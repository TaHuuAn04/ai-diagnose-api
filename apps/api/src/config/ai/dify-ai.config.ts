import { registerAs } from '@nestjs/config';

import { CONFIG_KEY } from '../config-key';

export default registerAs(CONFIG_KEY.DIFY_AI, () => ({
  baseUrl: process.env.DIFY_AI_API_URL,
  email: process.env.DIFY_AI_EMAIL,
  password: process.env.DIFY_AI_PASSWORD,
}));
