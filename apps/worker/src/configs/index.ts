import DifyAiConfig from 'apps/api/src/config/ai/dify-ai.config';
import RedisCacheConfig from 'apps/api/src/config/cache/redis-cache.config';

import AiServiceConfig from './ai-service/ai-service.config';
import BullMqConfig from './bull-mq/bull-mq.config';
import NovuConfig from './novu/novu.config';
import WinstonConfig from './winston/winston.config';


export const configurations = [
  BullMqConfig,
  NovuConfig,
  WinstonConfig,
  RedisCacheConfig,
  AiServiceConfig,
  DifyAiConfig,
];

export { AiServiceConfig, BullMqConfig, RedisCacheConfig as CacheConfig, NovuConfig, WinstonConfig, DifyAiConfig };
