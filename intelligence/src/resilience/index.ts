import { logger } from '../lib/logger.js';
import { getTraceId } from '../lib/tracing.js';

/**
 * Circuit breaker states.
 */
export type CircuitState = 'closed' | 'open' | 'half-open';

/**
 * Circuit breaker configuration.
 */
export interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  halfOpenMaxCalls: number;
}

/**
 * Circuit breaker instance.
 */
export class CircuitBreaker {
  private state: CircuitState = 'closed';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private halfOpenCalls = 0;

  constructor(private config: CircuitBreakerConfig) {}

  /**
   * Get current state.
   */
  getState(): CircuitState {
    // Check if we should transition from open to half-open
    if (this.state === 'open') {
      const timeSinceFailure = Date.now() - this.lastFailureTime;
      if (timeSinceFailure >= this.config.timeout) {
        this.state = 'half-open';
        this.halfOpenCalls = 0;
        logger.info('Circuit breaker transitioning to half-open', {
          name: this.config.name,
        });
      }
    }
    return this.state;
  }

  /**
   * Check if call is allowed.
   */
  canExecute(): boolean {
    const state = this.getState();

    if (state === 'closed') {
      return true;
    }

    if (state === 'half-open') {
      if (this.halfOpenCalls < this.config.halfOpenMaxCalls) {
        this.halfOpenCalls++;
        return true;
      }
      return false;
    }

    return false; // Open state
  }

  /**
   * Record successful call.
   */
  recordSuccess(): void {
    if (this.state === 'half-open') {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = 'closed';
        this.failureCount = 0;
        this.successCount = 0;
        logger.info('Circuit breaker closed', { name: this.config.name });
      }
    } else if (this.state === 'closed') {
      this.failureCount = 0; // Reset on success
    }
  }

  /**
   * Record failed call.
   */
  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === 'half-open') {
      // Any failure in half-open goes back to open
      this.state = 'open';
      this.successCount = 0;
      logger.warn('Circuit breaker opened (from half-open)', {
        name: this.config.name,
      });
    } else if (this.state === 'closed') {
      if (this.failureCount >= this.config.failureThreshold) {
        this.state = 'open';
        logger.warn('Circuit breaker opened', {
          name: this.config.name,
          failureCount: this.failureCount,
        });
      }
    }
  }

  /**
   * Execute with circuit breaker protection.
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.canExecute()) {
      throw new Error(`Circuit breaker ${this.config.name} is open`);
    }

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * Get circuit breaker stats.
   */
  getStats(): {
    state: CircuitState;
    failureCount: number;
    successCount: number;
    lastFailureTime: Date | null;
  } {
    return {
      state: this.getState(),
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime ? new Date(this.lastFailureTime) : null,
    };
  }

  /**
   * Reset the circuit breaker.
   */
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
    this.halfOpenCalls = 0;
    logger.info('Circuit breaker reset', { name: this.config.name });
  }
}

// ============================================
// Circuit Breaker Registry
// ============================================

const circuitBreakers = new Map<string, CircuitBreaker>();

/**
 * Get or create a circuit breaker.
 */
export function getCircuitBreaker(
  name: string,
  config?: Partial<CircuitBreakerConfig>
): CircuitBreaker {
  let cb = circuitBreakers.get(name);
  
  if (!cb) {
    cb = new CircuitBreaker({
      name,
      failureThreshold: config?.failureThreshold ?? 5,
      successThreshold: config?.successThreshold ?? 3,
      timeout: config?.timeout ?? 30000,
      halfOpenMaxCalls: config?.halfOpenMaxCalls ?? 3,
    });
    circuitBreakers.set(name, cb);
  }
  
  return cb;
}

/**
 * Get all circuit breaker stats.
 */
export function getAllCircuitBreakerStats(): Record<string, {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: Date | null;
}> {
  const stats: Record<string, ReturnType<CircuitBreaker['getStats']>> = {};
  
  for (const [name, cb] of circuitBreakers) {
    stats[name] = cb.getStats();
  }
  
  return stats;
}

// ============================================
// Proxy Rotation
// ============================================

/**
 * Proxy configuration.
 */
export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  protocol: 'http' | 'https' | 'socks5';
}

/**
 * Proxy pool manager.
 */
export class ProxyPool {
  private proxies: ProxyConfig[] = [];
  private currentIndex = 0;
  private failedProxies = new Set<string>();

  /**
   * Add a proxy to the pool.
   */
  addProxy(proxy: ProxyConfig): void {
    this.proxies.push(proxy);
    logger.debug('Proxy added to pool', { host: proxy.host, port: proxy.port });
  }

  /**
   * Get next proxy (round-robin).
   */
  getNextProxy(): ProxyConfig | null {
    if (this.proxies.length === 0) {
      return null;
    }

    // Filter out failed proxies
    const available = this.proxies.filter(
      (p) => !this.failedProxies.has(this.getProxyKey(p))
    );

    if (available.length === 0) {
      // Reset failed proxies if all are failed
      logger.warn('All proxies failed, resetting pool');
      this.failedProxies.clear();
      return this.proxies[0] ?? null;
    }

    const proxy = available[this.currentIndex % available.length];
    this.currentIndex = (this.currentIndex + 1) % available.length;
    return proxy ?? null;
  }

  /**
   * Mark a proxy as failed.
   */
  markFailed(proxy: ProxyConfig): void {
    const key = this.getProxyKey(proxy);
    this.failedProxies.add(key);
    logger.warn('Proxy marked as failed', { host: proxy.host, port: proxy.port });
  }

  /**
   * Mark a proxy as working.
   */
  markWorking(proxy: ProxyConfig): void {
    const key = this.getProxyKey(proxy);
    this.failedProxies.delete(key);
  }

  /**
   * Get proxy URL string.
   */
  getProxyUrl(proxy: ProxyConfig): string {
    const auth = proxy.username
      ? `${proxy.username}:${proxy.password}@`
      : '';
    return `${proxy.protocol}://${auth}${proxy.host}:${proxy.port}`;
  }

  /**
   * Get pool stats.
   */
  getStats(): {
    total: number;
    available: number;
    failed: number;
  } {
    return {
      total: this.proxies.length,
      available: this.proxies.length - this.failedProxies.size,
      failed: this.failedProxies.size,
    };
  }

  private getProxyKey(proxy: ProxyConfig): string {
    return `${proxy.host}:${proxy.port}`;
  }
}

// Global proxy pool instance
export const proxyPool = new ProxyPool();

// ============================================
// Domain Throttling
// ============================================

/**
 * Domain throttler for crawl rate limiting.
 */
export class DomainThrottler {
  private lastRequestTime = new Map<string, number>();
  private requestCounts = new Map<string, number>();

  constructor(
    private defaultDelayMs: number = 1000,
    private domainDelays: Map<string, number> = new Map()
  ) {}

  /**
   * Wait for domain throttle.
   */
  async throttle(domain: string): Promise<void> {
    const delay = this.domainDelays.get(domain) ?? this.defaultDelayMs;
    const lastRequest = this.lastRequestTime.get(domain) ?? 0;
    const elapsed = Date.now() - lastRequest;

    if (elapsed < delay) {
      const waitTime = delay - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime.set(domain, Date.now());
    this.requestCounts.set(domain, (this.requestCounts.get(domain) ?? 0) + 1);
  }

  /**
   * Set custom delay for a domain.
   */
  setDomainDelay(domain: string, delayMs: number): void {
    this.domainDelays.set(domain, delayMs);
    logger.debug('Domain delay set', { domain, delayMs });
  }

  /**
   * Get throttler stats.
   */
  getStats(): {
    domains: number;
    totalRequests: number;
    requestsByDomain: Record<string, number>;
  } {
    const requestsByDomain: Record<string, number> = {};
    let totalRequests = 0;

    for (const [domain, count] of this.requestCounts) {
      requestsByDomain[domain] = count;
      totalRequests += count;
    }

    return {
      domains: this.requestCounts.size,
      totalRequests,
      requestsByDomain,
    };
  }
}

// Global domain throttler instance
export const domainThrottler = new DomainThrottler();

// ============================================
// Horizontal Scaling Utilities
// ============================================

/**
 * Worker scaling configuration.
 */
export interface WorkerScalingConfig {
  minWorkers: number;
  maxWorkers: number;
  scaleUpThreshold: number; // Queue size to trigger scale up
  scaleDownThreshold: number; // Queue size to trigger scale down
  cooldownSeconds: number;
}

/**
 * Default worker scaling config.
 */
export const DEFAULT_WORKER_SCALING: WorkerScalingConfig = {
  minWorkers: 1,
  maxWorkers: 10,
  scaleUpThreshold: 100,
  scaleDownThreshold: 10,
  cooldownSeconds: 60,
};

/**
 * Calculate optimal worker count based on queue size.
 */
export function calculateOptimalWorkerCount(
  queueSize: number,
  currentWorkers: number,
  config: WorkerScalingConfig = DEFAULT_WORKER_SCALING
): number {
  if (queueSize >= config.scaleUpThreshold && currentWorkers < config.maxWorkers) {
    return Math.min(currentWorkers + 1, config.maxWorkers);
  }

  if (queueSize <= config.scaleDownThreshold && currentWorkers > config.minWorkers) {
    return Math.max(currentWorkers - 1, config.minWorkers);
  }

  return currentWorkers;
}
