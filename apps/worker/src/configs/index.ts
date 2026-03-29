import AiServiceConfig from './ai-service/ai-service.config';
import BullMqConfig from './bull-mq/bull-mq.config';
import CacheConfig from './cache/redis-cache.config';
import NovuConfig from './novu/novu.config';
import WinstonConfig from './winston/winston.config';

export const configurations = [
  BullMqConfig,
  NovuConfig,
  WinstonConfig,
  CacheConfig,
  AiServiceConfig,
];

export { AiServiceConfig, BullMqConfig, CacheConfig, NovuConfig, WinstonConfig };
