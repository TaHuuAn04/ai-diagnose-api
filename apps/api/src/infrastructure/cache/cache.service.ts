import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

import { InternalServerErrorException } from '@app/core/exception';

import { ICacheService } from './cache.service.interface';

export class CacheService implements ICacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async get(key: string): Promise<string | null> {
    try {
      const result = await this.redis.get(key);
      return result;
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';
      throw new InternalServerErrorException(message);
    }
  }
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      await this.redis.set(key, value);
      if (ttl) {
        await this.redis.expire(key, ttl);
      }
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';
      throw new InternalServerErrorException(message);
    }
  }
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';
      throw new InternalServerErrorException(message);
    }
  }

  async deleteByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';
      throw new InternalServerErrorException(message);
    }
  }
}
