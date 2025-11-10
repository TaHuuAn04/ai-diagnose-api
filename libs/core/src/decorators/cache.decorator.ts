import { Inject } from '@nestjs/common';

import { INJECTION_TOKEN } from '@api/enums';
import { ICacheService } from 'apps/api/src/infrastructure/cache';

export interface CacheOptions<T = unknown> {
  ttl?: number; // Time to live in seconds
  keyPrefix?: string;
  keyFromArgs?: (args: unknown[]) => string; // Function to extract key from arguments
  serialize?: (value: T) => string; // Custom serialization function
  deserialize?: (value: string) => T; // Custom deserialization function
}

export function Cache<T = unknown>(options: CacheOptions<T> = {}) {
  const inject = Inject(INJECTION_TOKEN.CACHE_SERVICE);
  return (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    inject(target, 'cacheService');

    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Promise<T>;

    descriptor.value = async function (...args: unknown[]) {
      const cacheService = (this as { cacheService: ICacheService })
        .cacheService;

      const keyPrefix =
        options.keyPrefix ?? `${target.constructor.name}_${propertyKey}`;

      // Use keyFromArgs function if provided, otherwise use all args
      const argsKey = options.keyFromArgs
        ? options.keyFromArgs(args)
        : JSON.stringify(args);
      const cacheKey = `${keyPrefix}:${argsKey}`;

      // Try to get from cache
      const cachedValue = await cacheService.get(cacheKey);
      if (cachedValue) {
        return options.deserialize
          ? options.deserialize(cachedValue)
          : (JSON.parse(cachedValue) as T);
      }

      // If not in cache, execute the original method
      const result = (await originalMethod.apply(this, args)) as T;

      // Store in cache
      const serializedValue = options.serialize
        ? options.serialize(result)
        : JSON.stringify(result);
      await cacheService.set(cacheKey, serializedValue, options.ttl);

      return result;
    };

    return descriptor;
  };
}
