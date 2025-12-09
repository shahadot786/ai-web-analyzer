import { ScrapeResult } from '../types/index.js';

interface CacheEntry {
  result: ScrapeResult;
  timestamp: Date;
  expiresAt: Date;
}

class CacheService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  /**
   * Get cached result for a URL
   */
  get(url: string): ScrapeResult | null {
    const entry = this.cache.get(url);
    
    if (!entry) {
      return null;
    }

    // Check if cache has expired
    if (new Date() > entry.expiresAt) {
      this.cache.delete(url);
      return null;
    }

    return entry.result;
  }

  /**
   * Set cache for a URL
   */
  set(url: string, result: ScrapeResult, ttl: number = this.DEFAULT_TTL): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttl);

    this.cache.set(url, {
      result,
      timestamp: now,
      expiresAt
    });
  }

  /**
   * Check if URL is cached and not expired
   */
  has(url: string): boolean {
    const entry = this.cache.get(url);
    
    if (!entry) {
      return false;
    }

    if (new Date() > entry.expiresAt) {
      this.cache.delete(url);
      return false;
    }

    return true;
  }

  /**
   * Clear specific URL from cache
   */
  delete(url: string): boolean {
    return this.cache.delete(url);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = new Date();
    let validEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach((entry) => {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = new Date();
    const toDelete: string[] = [];

    this.cache.forEach((entry, url) => {
      if (now > entry.expiresAt) {
        toDelete.push(url);
      }
    });

    toDelete.forEach(url => this.cache.delete(url));
  }
}

export const cacheService = new CacheService();

// Run cleanup every 10 minutes
setInterval(() => {
  cacheService.cleanup();
}, 10 * 60 * 1000);
