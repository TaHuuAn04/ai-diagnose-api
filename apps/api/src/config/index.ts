import DifyAiConfig from './ai/dify-ai.config';
import AuthJwtConfig from './auth/jwt-auth.config';
import RedisCacheConfig from './cache/redis-cache.config';
import TypeOrmNestDatabaseConfig from './database/typeorm-nest/database.config';
import InternalWorkerConfig from './worker/internal-worker.config';

export const configurations = [
  TypeOrmNestDatabaseConfig,
  AuthJwtConfig,
  DifyAiConfig,
  RedisCacheConfig,
  InternalWorkerConfig,
];

export {
  AuthJwtConfig,
  DifyAiConfig,
  RedisCacheConfig,
  TypeOrmNestDatabaseConfig,
  InternalWorkerConfig,
};
