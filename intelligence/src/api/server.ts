import { getSystemHealth, readinessCheck, getPrometheusMetrics, getJSONMetrics } from './health.js';
import { submitUrl, submitUrls } from '../pipeline/workers.js';
import { getDossier, getDossiersByStatus, exportDossierAsJSON, exportDossierAsMarkdown, markDossierAsConsumed } from '../dossier/generator.js';
import { getLeadsByStatus } from '../scoring/decision-layer.js';
import { recordFeedback, getDossierFeedback } from '../feedback/loop.js';
import { searchSimilarDocumentsWithData } from '../embeddings/vector-store.js';
import { logger, logStream } from '../lib/logger.js';
import { HPCL_DATA_SOURCES } from '../crawler/hpcl-sources.js';
import { withTrace, generateTraceId, getTraceId } from '../lib/tracing.js';
import { validate } from '../lib/validation.js';
import { z } from 'zod';
import http from 'http';
import { URL } from 'url';
import fs from 'fs';
import path from 'path';

/**
 * Helper to serve static files.
 */
function serveStatic(res: http.ServerResponse, filePath: string, contentType: string) {
  const fullPath = path.join(process.cwd(), 'public', filePath);
  fs.readFile(fullPath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('File not found');
      } else {
        res.statusCode = 500;
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

export interface APIConfig {
  port: number;
  host: string;
  basePath: string;
}

/**
 * Default API configuration.
 */
const DEFAULT_CONFIG: APIConfig = {
  port: 3000,
  host: '0.0.0.0',
  basePath: '/api/v1',
};

/**
 * Request handler function type.
 */
type RequestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  params: Record<string, string>,
  body: unknown
) => Promise<void>;

/**
 * Route definition.
 */
interface Route {
  method: 'GET' | 'POST' | 'DELETE';
  pattern: RegExp;
  paramNames: string[];
  handler: RequestHandler;
}

/**
 * Routes registry.
 */
const routes: Route[] = [];

/**
 * Register a route.
 */
function addRoute(
  method: 'GET' | 'POST' | 'DELETE',
  path: string,
  handler: RequestHandler
): void {
  const paramNames: string[] = [];
  const patternStr = path.replace(/:(\w+)/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  const pattern = new RegExp(`^${patternStr}$`);
  routes.push({ method, pattern, paramNames, handler });
}

/**
 * Parse request body as JSON.
 */
async function parseBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      if (!data) {
        resolve(null);
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response.
 */
function sendJSON(res: http.ServerResponse, status: number, data: unknown): void {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

/**
 * Send text response.
 */
function sendText(res: http.ServerResponse, status: number, text: string, contentType: string = 'text/plain'): void {
  res.setHeader('Content-Type', contentType);
  res.statusCode = status;
  res.end(text);
}

// ============================================
// Route Handlers
// ============================================

addRoute('GET', '/', (_req, res) => {
  serveStatic(res, 'index.html', 'text/html');
  return Promise.resolve();
});

addRoute('GET', '/index.html', (_req, res) => {
  serveStatic(res, 'index.html', 'text/html');
  return Promise.resolve();
});

addRoute('GET', '/styles.css', (_req, res) => {
  serveStatic(res, 'styles.css', 'text/css');
  return Promise.resolve();
});

addRoute('GET', '/app.js', (_req, res) => {
  serveStatic(res, 'app.js', 'text/javascript');
  return Promise.resolve();
});

// Health endpoints
addRoute('GET', '/health', async (req, res) => {
  const health = await getSystemHealth();
  const status = health.status === 'unhealthy' ? 503 : 200;
  sendJSON(res, status, health);
});

addRoute('GET', '/health/live', async (req, res) => {
  sendJSON(res, 200, { status: 'ok' });
});

addRoute('GET', '/health/ready', async (req, res) => {
  const ready = await readinessCheck();
  sendJSON(res, ready ? 200 : 503, { ready });
});

addRoute('GET', '/metrics', async (req, res) => {
  const metrics = await getPrometheusMetrics();
  sendText(res, 200, metrics, 'text/plain; version=0.0.4');
});
addRoute('GET', '/metrics/json', async (req, res) => {
  const metrics = await getJSONMetrics();
  sendJSON(res, 200, metrics);
});

// Log streaming endpoint (SSE)
addRoute('GET', '/logs/stream', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  const listener = (info: any) => {
    res.write(`data: ${JSON.stringify(info)}\n\n`);
  };

  logStream.on('log', listener);

  // Send initial message
  res.write(`data: ${JSON.stringify({ message: 'Connected to log stream', timestamp: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    logStream.removeListener('log', listener);
  });
});

// URL submission endpoints
addRoute('POST', '/urls', async (req, res, params, body) => {
  const schema = z.object({
    url: z.string().url(),
    sourceType: z.enum(['html', 'rss', 'pdf']).optional(),
    priority: z.number().min(1).max(10).optional(),
  });

  const validation = validate(schema, body);
  if (!validation.success) {
    sendJSON(res, 400, { error: 'Validation failed', details: validation.errors });
    return;
  }

  const options: { sourceType?: 'html' | 'rss' | 'pdf'; priority?: number } = {};
  if (validation.data.sourceType) options.sourceType = validation.data.sourceType;
  if (validation.data.priority) options.priority = validation.data.priority;

  const jobId = await submitUrl(validation.data.url, options);

  sendJSON(res, 202, { jobId, url: validation.data.url });
});

addRoute('POST', '/urls/batch', async (req, res, params, body) => {
  const schema = z.object({
    urls: z.array(z.string().url()).min(1).max(100),
    sourceType: z.enum(['html', 'rss', 'pdf']).optional(),
    priority: z.number().min(1).max(10).optional(),
  });

  const validation = validate(schema, body);
  if (!validation.success) {
    sendJSON(res, 400, { error: 'Validation failed', details: validation.errors });
    return;
  }

  const options: { sourceType?: 'html' | 'rss' | 'pdf'; priority?: number } = {};
  if (validation.data.sourceType) options.sourceType = validation.data.sourceType;
  if (validation.data.priority) options.priority = validation.data.priority;

  const jobIds = await submitUrls(validation.data.urls, options);

  sendJSON(res, 202, { jobIds, count: jobIds.length });
});

// Trigger scraping job
addRoute('POST', '/jobs/scrape', async (req, res, params, body) => {
  const schema = z.object({
    sources: z.union([z.literal('all'), z.array(z.string())]),
    priority: z.number().min(1).max(10).optional(),
  });

  const validation = validate(schema, body);
  if (!validation.success) {
    sendJSON(res, 400, { error: 'Validation failed', details: validation.errors });
    return;
  }

  const priority = validation.data.priority || 5;
  let targets = [];

  if (validation.data.sources === 'all') {
    targets = HPCL_DATA_SOURCES.filter(s => s.enabled);
  } else {
    const ids = new Set(validation.data.sources);
    targets = HPCL_DATA_SOURCES.filter(s => ids.has(s.id));
  }

  const jobIds = await submitUrls(
    targets.map(t => t.url), 
    { priority }
  );

  sendJSON(res, 202, { 
    message: `Triggered scale scrape for ${targets.length} sources`, 
    jobIds,
    count: jobIds.length 
  });
});

// Search endpoints
addRoute('POST', '/search', async (req, res, params, body) => {
  const schema = z.object({
    query: z.string().min(1).max(1000),
    limit: z.number().min(1).max(50).optional(),
  });

  const validation = validate(schema, body);
  if (!validation.success) {
    sendJSON(res, 400, { error: 'Validation failed', details: validation.errors });
    return;
  }

  const results = await searchSimilarDocumentsWithData(
    validation.data.query,
    validation.data.limit || 10
  );

  sendJSON(res, 200, { results, count: results.length });
});

// Dossier endpoints
addRoute('GET', '/dossiers/:id', async (req, res, params) => {
  const dossier = await getDossier(params['id'] || '');
  if (!dossier) {
    sendJSON(res, 404, { error: 'Dossier not found' });
    return;
  }
  sendJSON(res, 200, dossier);
});

addRoute('GET', '/dossiers/:id/markdown', async (req, res, params) => {
  const dossier = await getDossier(params['id'] || '');
  if (!dossier) {
    sendJSON(res, 404, { error: 'Dossier not found' });
    return;
  }
  const markdown = exportDossierAsMarkdown(dossier);
  sendText(res, 200, markdown, 'text/markdown');
});

addRoute('POST', '/dossiers/:id/consume', async (req, res, params) => {
  const dossier = await markDossierAsConsumed(params['id'] || '');
  if (!dossier) {
    sendJSON(res, 404, { error: 'Dossier not found' });
    return;
  }
  sendJSON(res, 200, dossier);
});

addRoute('GET', '/dossiers', async (req, res) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const status = url.searchParams.get('status') as 'approved' | 'review_needed' | 'rejected' | null;
  const limit = parseInt(url.searchParams.get('limit') || '20', 10);
  const consumedParam = url.searchParams.get('consumed');
  let consumed: boolean | undefined;
  
  if (consumedParam === 'true') consumed = true;
  if (consumedParam === 'false') consumed = false;

  if (status && !['approved', 'review_needed', 'rejected'].includes(status)) {
    sendJSON(res, 400, { error: 'Invalid status parameter' });
    return;
  }

  const dossiers = await getDossiersByStatus(status || 'review_needed', limit, consumed);
  sendJSON(res, 200, { dossiers, count: dossiers.length });
});

// Lead endpoints
addRoute('GET', '/leads', async (req, res) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const status = url.searchParams.get('status') as 'approved' | 'review_needed' | 'rejected' | null;
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);

  const leads = await getLeadsByStatus(status || 'review_needed', limit);
  sendJSON(res, 200, { leads, count: leads.length });
});

// Feedback endpoints
addRoute('POST', '/feedback', async (req, res, params, body) => {
  const schema = z.object({
    dossierId: z.string().uuid(),
    type: z.enum(['positive', 'negative', 'correction']),
    score: z.number().min(0).max(1),
    comment: z.string().max(1000).optional(),
    userId: z.string().optional(),
  });

  const validation = validate(schema, body);
  if (!validation.success) {
    sendJSON(res, 400, { error: 'Validation failed', details: validation.errors });
    return;
  }

  const feedback = await recordFeedback(
    validation.data.dossierId,
    validation.data.type,
    validation.data.score,
    validation.data.comment,
    validation.data.userId
  );

  sendJSON(res, 201, feedback);
});

addRoute('GET', '/feedback/:dossierId', async (req, res, params) => {
  const feedback = await getDossierFeedback(params['dossierId'] || '');
  sendJSON(res, 200, { feedback, count: feedback.length });
});

// ============================================
// Server
// ============================================

let server: http.Server | null = null;

/**
 * Start the API server.
 */
export function startAPIServer(config: Partial<APIConfig> = {}): http.Server {
  const opts = { ...DEFAULT_CONFIG, ...config };

  server = http.createServer(async (req, res) => {
    await withTrace(async () => {
      const traceId = getTraceId();
      const startTime = Date.now();

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Trace-ID');

      // Handle preflight
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const path = url.pathname.replace(opts.basePath, '') || '/';

      logger.debug('API request', { method: req.method, path, traceId });

      try {
        // Find matching route
        let matched = false;
        for (const route of routes) {
          if (req.method !== route.method) continue;

          const match = path.match(route.pattern);
          if (match) {
            matched = true;

            // Extract params
            const params: Record<string, string> = {};
            route.paramNames.forEach((name, i) => {
              params[name] = match[i + 1] || '';
            });

            // Parse body for POST
            let body: unknown = null;
            if (req.method === 'POST') {
              body = await parseBody(req);
            }

            await route.handler(req, res, params, body);
            break;
          }
        }

        if (!matched) {
          sendJSON(res, 404, { error: 'Not found' });
        }
      } catch (error) {
        logger.error('API error', {
          method: req.method,
          path,
          error: error instanceof Error ? error.message : String(error),
          traceId,
        });

        sendJSON(res, 500, {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      const duration = Date.now() - startTime;
      logger.info('API response', {
        method: req.method,
        path,
        status: res.statusCode,
        durationMs: duration,
        traceId,
      });
    });
  });

  server.listen(opts.port, opts.host, () => {
    logger.info(`API server started on http://${opts.host}:${opts.port}${opts.basePath}`);
  });

  return server;
}

/**
 * Stop the API server.
 */
export function stopAPIServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }

    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        server = null;
        logger.info('API server stopped');
        resolve();
      }
    });
  });
}
