import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, Reflector } from '@nestjs/core';

import { CoreTransformInterceptor } from '@app/core/interceptors';

import { JwtAuthGuard } from './common/guards';
import { ConfigsModule } from './config/configs.module';
import { infrastructures } from './infrastructure';
import { modules } from './modules';

@Module({
  imports: [ConfigsModule, ...infrastructures, ...modules],
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
