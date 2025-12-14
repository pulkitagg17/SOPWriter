import { CACHE } from '../constants/index.js';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

/**
 * Simple in-memory cache service
 * For production, consider using Redis
 */
export class CacheService {
  private static instance: CacheService | null = null;
  private cache: Map<string, CacheEntry<any>>;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get cached value or fetch from provided function
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number = CACHE.DEFAULT_TTL_SECONDS
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached value if valid
    if (cached && cached.expiresAt > now) {
      return cached.data as T;
    }

    // Fetch fresh data
    const data = await fetchFn();
    this.cache.set(key, {
      data,
      expiresAt: now + ttlSeconds * 1000,
    });

    return data;
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate keys matching pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cacheService = CacheService.getInstance();
