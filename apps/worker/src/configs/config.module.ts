import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateConfig } from './config-validation';

import { configurations } from '.';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: configurations,
      cache: true,
      validate: validateConfig,
    }),
  ],
})
export class ConfigsModule {}
