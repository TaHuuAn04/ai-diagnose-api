import BullMqConfig from './bull-mq/bull-mq.config';
import CacheConfig from './cache/redis-cache.config';
import NovuConfig from './novu/novu.config';
import WinstonConfig from './winston/winston.config';

export const configurations = [
  BullMqConfig,
  NovuConfig,
  WinstonConfig,
  CacheConfig,
];

export { BullMqConfig, CacheConfig, NovuConfig, WinstonConfig };
