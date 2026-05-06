import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

import { CoreTransformInterceptor } from '@app/core/interceptors';

import { JwtAuthGuard } from './common/guards';
import { ConfigsModule } from './config/configs.module';
import { infrastructures } from './infrastructure';
import { MetricsInterceptor } from './metrics.interceptor';
import { modules } from './modules';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 10000 }]),
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
    }),
    ConfigsModule,
    ...infrastructures,
    ...modules,
  ],
  providers: [
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10],
    }),
    makeCounterProvider({
      name: 'http_request_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class MainModule {}
