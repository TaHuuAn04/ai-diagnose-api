import { registerAs } from '@nestjs/config';

import { CONFIG_KEY } from '../config-key';

export default registerAs(CONFIG_KEY.AUTH, () => ({
  jwtSecret: process.env.ACCESS_TOKEN_SECRET ?? 'xw5DjZgX3TkTT',
  accessTokenExpiration: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '7d', // 7 days
  resetPasswordKey: process.env.JWT_RESET_PASSWORD_KEY ?? 's21DjZg12Jde',
}));
