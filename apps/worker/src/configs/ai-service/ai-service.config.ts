import { registerAs } from '@nestjs/config';

import { AI_SERVICE_BASE_URL } from '@app/core/environments';

import { CONFIG_KEY } from '../config-key';

export interface AiServiceConfigType {
  baseUrl: string;
}

export default registerAs<AiServiceConfigType>(CONFIG_KEY.AI_SERVICE, () => ({
  baseUrl: AI_SERVICE_BASE_URL || 'http://localhost:8000',
}));
