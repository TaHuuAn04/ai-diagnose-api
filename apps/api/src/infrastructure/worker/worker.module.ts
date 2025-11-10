import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { InternalWorkerConfig } from '../../config';

import { InternalWorkerService } from './internal-worker.service';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [InternalWorkerConfig.KEY],
      useFactory: (config: ConfigType<typeof InternalWorkerConfig>) => {
        return {
          baseURL: config.baseUrl,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
  ],
  exports: [InternalWorkerService],
  providers: [InternalWorkerService],
})
export class WorkerModule {}
