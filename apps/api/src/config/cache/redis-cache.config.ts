import { registerAs } from '@nestjs/config';

import { RedisModuleOptions } from '@nestjs-modules/ioredis';

import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@app/core/environments';

import { CONFIG_KEY } from '../config-key';

export default registerAs<RedisModuleOptions>(CONFIG_KEY.CACHE, () => ({
  type: 'single',
  url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT.toString()}`,
}));
