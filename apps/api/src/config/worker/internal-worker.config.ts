import { registerAs } from '@nestjs/config';

import { CONFIG_KEY } from '../config-key';

export default registerAs(CONFIG_KEY.INTERNAL_WORKER, () => ({
  baseUrl: process.env.INTERNAL_WORKER_API_URL,
}));
