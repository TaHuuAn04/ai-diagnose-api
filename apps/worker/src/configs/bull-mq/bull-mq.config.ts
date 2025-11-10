import { registerAs } from '@nestjs/config';

import { QueueOptions } from 'bullmq';

import {
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
} from '@app/core/environments';

import { CONFIG_KEY } from '../config-key';

export default registerAs<QueueOptions>(CONFIG_KEY.BULL_MQ, () => ({
  connection: {
    host: REDIS_HOST || 'localhost',
    port: REDIS_PORT || 6380,
    db: REDIS_DB || 0,
    password: REDIS_PASSWORD || '',
  },
}));
