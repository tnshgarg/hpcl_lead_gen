import { EventEmitter } from 'events';
import winston from 'winston';
import { env } from '../config/env.js';
import { getTraceId } from './tracing.js';

/**
 * Event emitter for log streaming.
 */
export const logStream = new EventEmitter();

/**
 * Custom log format with structured JSON output.
 * Includes timestamp, level, message, trace ID, and any additional metadata.
 */
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'ISO' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const traceId = getTraceId();
    const logObject = {
      timestamp,
      level,
      traceId,
      message,
      stack: stack || undefined,
      ...meta,
    };
    return JSON.stringify(logObject);
  })
);

/**
 * Console format for development with colors.
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const traceId = getTraceId();
    const traceStr = traceId ? ` [${traceId.slice(0, 8)}]` : '';
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}${traceStr}: ${message}${metaStr}`;
  })
);

// Add a custom transport to emit logs to the stream
// We use 'any' for the base class to avoid strict type checks with winston versions
class StreamTransport extends (winston.transports.Console as any) {
  constructor(opts?: any) {
    super(opts);
  }

  log(info: any, callback: () => void) {
    logStream.emit('log', info);
    if (callback) {
      callback();
    }
  }
}

/**
 * Winston logger instance configured based on environment.
 * 
 * Features:
 * - Structured JSON logging in production
 * - Colored console output in development
 * - Trace ID injection for request correlation
 * - File transport for persistent logs
 */
export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: structuredFormat,
  defaultMeta: { service: 'web-intelligence-layer' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
    // Write error logs separately
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
    // Stream logs to EventEmitter
    new StreamTransport() as any,
  ],
});


// Add console transport in non-production environments
if (env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

/**
 * Create a child logger with additional context.
 */
export function createChildLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log an artifact creation for reproducibility tracking.
 */
export function logArtifact(
  type: string,
  id: string,
  inputHash: string,
  outputHash: string,
  metadata?: Record<string, unknown>
) {
  logger.info('Artifact created', {
    artifactType: type,
    artifactId: id,
    inputHash,
    outputHash,
    ...metadata,
  });
}

/**
 * Log a pipeline stage completion.
 */
export function logStage(
  stage: string,
  status: 'started' | 'completed' | 'failed',
  durationMs?: number,
  metadata?: Record<string, unknown>
) {
  const level = status === 'failed' ? 'error' : 'info';
  logger.log(level, `Pipeline stage ${status}`, {
    stage,
    status,
    ...(durationMs !== undefined && { durationMs }),
    ...metadata,
  });
}
