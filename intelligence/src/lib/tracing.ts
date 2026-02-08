import { AsyncLocalStorage } from 'async_hooks';
import { v4 as uuidv4 } from 'uuid';

/**
 * Trace context interface for request correlation.
 */
export interface TraceContext {
  /** Unique trace ID for the entire request/job */
  traceId: string;
  /** Span ID for the current operation */
  spanId: string;
  /** Parent span ID if nested */
  parentSpanId?: string;
  /** Additional context metadata */
  metadata: Record<string, unknown>;
}

/**
 * AsyncLocalStorage for maintaining trace context across async operations.
 */
const traceStorage = new AsyncLocalStorage<TraceContext>();

/**
 * Generate a new trace ID.
 */
export function generateTraceId(): string {
  return uuidv4();
}

/**
 * Generate a new span ID.
 */
export function generateSpanId(): string {
  return uuidv4().slice(0, 16);
}

/**
 * Get the current trace ID from context.
 * Returns undefined if not in a traced context.
 */
export function getTraceId(): string | undefined {
  return traceStorage.getStore()?.traceId;
}

/**
 * Get the current span ID from context.
 */
export function getSpanId(): string | undefined {
  return traceStorage.getStore()?.spanId;
}

/**
 * Get the full trace context.
 */
export function getTraceContext(): TraceContext | undefined {
  return traceStorage.getStore();
}

/**
 * Run a function within a new trace context.
 * Use this for new requests/jobs that need their own trace.
 */
export function withTrace<T>(
  fn: () => T,
  existingTraceId?: string,
  metadata: Record<string, unknown> = {}
): T {
  const context: TraceContext = {
    traceId: existingTraceId || generateTraceId(),
    spanId: generateSpanId(),
    metadata,
  };

  return traceStorage.run(context, fn);
}

/**
 * Run a function within a new span, maintaining the parent trace context.
 * Use this for nested operations within the same request/job.
 */
export function withSpan<T>(
  spanName: string,
  fn: () => T,
  metadata: Record<string, unknown> = {}
): T {
  const parentContext = traceStorage.getStore();

  if (!parentContext) {
    // No parent context, create a new trace
    return withTrace(fn, undefined, { spanName, ...metadata });
  }

  const context: TraceContext = {
    traceId: parentContext.traceId,
    spanId: generateSpanId(),
    parentSpanId: parentContext.spanId,
    metadata: { spanName, ...metadata },
  };

  return traceStorage.run(context, fn);
}

/**
 * Async version of withTrace for async functions.
 */
export async function withTraceAsync<T>(
  fn: () => Promise<T>,
  existingTraceId?: string,
  metadata: Record<string, unknown> = {}
): Promise<T> {
  const context: TraceContext = {
    traceId: existingTraceId || generateTraceId(),
    spanId: generateSpanId(),
    metadata,
  };

  return traceStorage.run(context, fn);
}

/**
 * Async version of withSpan for async functions.
 */
export async function withSpanAsync<T>(
  spanName: string,
  fn: () => Promise<T>,
  metadata: Record<string, unknown> = {}
): Promise<T> {
  const parentContext = traceStorage.getStore();

  if (!parentContext) {
    return withTraceAsync(fn, undefined, { spanName, ...metadata });
  }

  const context: TraceContext = {
    traceId: parentContext.traceId,
    spanId: generateSpanId(),
    parentSpanId: parentContext.spanId,
    metadata: { spanName, ...metadata },
  };

  return traceStorage.run(context, fn);
}

/**
 * Add metadata to the current trace context.
 */
export function addTraceMetadata(key: string, value: unknown): void {
  const context = traceStorage.getStore();
  if (context) {
    context.metadata[key] = value;
  }
}
