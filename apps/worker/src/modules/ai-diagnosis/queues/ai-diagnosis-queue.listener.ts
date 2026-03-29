import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { AI_DIAGNOSIS_QUEUE } from '.';

@QueueEventsListener(AI_DIAGNOSIS_QUEUE.NAME)
export class AiDiagnosisQueueListener extends QueueEventsHost {
  private readonly logger = new Logger(AiDiagnosisQueueListener.name);

  @OnQueueEvent('active')
  onActive(job: { jobId: string; prev?: string }) {
    this.logger.debug(`Processing AI diagnosis job with id ${job.jobId}...`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; prev?: string }) {
    this.logger.debug(`AI diagnosis job with id ${job.jobId} completed`);
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string; prev?: string; failedReason?: string }) {
    this.logger.error(`AI diagnosis job with id ${job.jobId} failed. Reason: ${job.failedReason}`);
  }
}
