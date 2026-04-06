import { registerAs } from '@nestjs/config';

import { INTERNAL_WORKER_API_URL } from '@app/core/environments';

import { CONFIG_KEY } from '../config-key';

export default registerAs(CONFIG_KEY.INTERNAL_WORKER, () => ({
  baseUrl: INTERNAL_WORKER_API_URL,
}));
