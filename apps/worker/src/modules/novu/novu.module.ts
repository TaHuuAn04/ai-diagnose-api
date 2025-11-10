import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { TriggerNovuService } from './novu-trigger.service';
import { NovuProcessor } from './novu.processor';
import { NovuService } from './novu.service';
import { NOVU_QUEUE_NAME } from './queues';

@Module({
  imports: [
    BullModule.registerQueue({
      name: NOVU_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: {
          count: 1000,
        },
      },
    }),
  ],
  controllers: [],
  providers: [NovuService, NovuProcessor, TriggerNovuService],
  exports: [NovuService, TriggerNovuService],
})
export class NovuModule {}
