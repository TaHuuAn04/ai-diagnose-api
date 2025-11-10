import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { RedisModule } from '@nestjs-modules/ioredis';

import { RedisCacheConfig } from '../../config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [RedisCacheConfig.KEY],
      useFactory: (config: ConfigType<typeof RedisCacheConfig>) => config,
    }),
  ],
})
export class RedisCacheModule {}
