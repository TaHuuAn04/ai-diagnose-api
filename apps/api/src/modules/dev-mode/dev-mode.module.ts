import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';

import { DevModeController } from './dev-mode.controller';
import { DevModeService } from './dev-mode.service';

export class DevModeModule {
  static config = new ConfigService();

  static registerAsync(): DynamicModule {
    const controllers =
      DevModeModule.config.get('API_NODE_ENV') === 'development' ||
      DevModeModule.config.get('API_NODE_ENV') === 'local'
        ? [DevModeController]
        : [];

    return {
      imports: [AuthModule],
      module: DevModeModule,
      providers: [DevModeService],
      controllers,
    };
  }
}
