import { registerAs } from '@nestjs/config';

import { NOVU_API_KEY, NOVU_SERVER_URL } from '@app/core/environments';

import { CONFIG_KEY } from '../config-key';

export default registerAs(CONFIG_KEY.NOVU, () => ({
  novuApiKey: NOVU_API_KEY || '',
  novuServerUrl: NOVU_SERVER_URL || '',
}));
