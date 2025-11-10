import { BullModule } from '@nestjs/bullmq';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';

import { WinstonModule, WinstonModuleOptions } from 'nest-winston';

import { CoreTransformInterceptor } from '@app/core/interceptors';

import { BullMqConfig, WinstonConfig } from './configs';
import { ConfigsModule } from './configs/config.module';

import { modules } from '.';

@Module({
  imports: [
    ConfigsModule,
    ...modules,
    BullModule.forRootAsync({
      inject: [BullMqConfig.KEY],
      useFactory: (config: ConfigType<typeof BullMqConfig>) => {
        return config;
      },
    }),
    WinstonModule.forRootAsync({
      inject: [WinstonConfig.KEY],
      useFactory: (config: ConfigType<typeof WinstonConfig>) => {
        return config as WinstonModuleOptions;
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CoreTransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) => {
        return new ClassSerializerInterceptor(reflector, {
          strategy: 'excludeAll',
          excludeExtraneousValues: true,
          enableImplicitConversion: false,
          exposeDefaultValues: false,
          enableCircularCheck: true,
          exposeUnsetFields: true,
        });
      },
      inject: [Reflector],
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class WorkerModule {}
