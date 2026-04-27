import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AiDiagnosisController } from './ai-diagnosis.controller';
import { AiDiagnosisHttpService } from './infrastructures/ai-diagnosis-http.service';
import { AI_DIAGNOSIS_QUEUE } from './queues';
import { AiDiagnosisQueueConsumer } from './queues/ai-diagnosis-queue.consumer';
import { AiDiagnosisQueueListener } from './queues/ai-diagnosis-queue.listener';
import { AiDiagnosisQueueProvider } from './queues/ai-diagnosis-queue.provider';
import { ProcessAiDiagnosisCommandHandler } from './use-cases';
import { DifyAiModule } from 'apps/api/src/modules/dify-ai/dify-ai.module';

const Handlers = [ProcessAiDiagnosisCommandHandler];

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    BullModule.registerQueue({
      name: AI_DIAGNOSIS_QUEUE.NAME,
      defaultJobOptions: {
        removeOnComplete: {
          count: 1000,
        },
        attempts: 1,
      },
    }),
    DifyAiModule,
  ],
  controllers: [AiDiagnosisController],
  providers: [
    ...Handlers,
    AiDiagnosisHttpService,
    AiDiagnosisQueueProvider,
    AiDiagnosisQueueConsumer,
    AiDiagnosisQueueListener,
  ],
})
export class AiDiagnosisModule {}
