import { Inject } from '@nestjs/common';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { ICacheService } from 'apps/api/src/infrastructure/cache';

import { DIFY_AI_ACCESS_TOKEN_EXPIRE } from '@app/core/environments';
import { AiInternalServerError } from '@app/core/exception';

import { IDifyCacheService } from '../use-cases/adapters';

const keyPrefix = 'dify_ai_access_token';

export class DifyCacheService implements IDifyCacheService {
  constructor(
    @Inject(INJECTION_TOKEN.CACHE_SERVICE)
    private cacheService: ICacheService,
  ) {}

  async saveDifyAccessToken(
    userEmail: string,
    accessToken: string,
  ): Promise<void> {
    try {
      const key = `${keyPrefix}:${userEmail}`;
      await this.cacheService.set(
        key,
        accessToken,
        DIFY_AI_ACCESS_TOKEN_EXPIRE,
      );
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';
      throw new AiInternalServerError(message);
    }
  }

  async getDifyAccessToken(userEmail: string): Promise<string | null> {
    try {
      const key = `${keyPrefix}:${userEmail}`;
      return await this.cacheService.get(key);
    } catch (error) {
      const message =
        error instanceof Error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';
      throw new AiInternalServerError(message);
    }
  }
}
