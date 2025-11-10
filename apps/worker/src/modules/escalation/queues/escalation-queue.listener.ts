import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

import { ESCALATION_QUEUE } from '.';

@QueueEventsListener(ESCALATION_QUEUE.NAME)
export class EscalationQueueListener extends QueueEventsHost {
  private readonly logger = new Logger(EscalationQueueListener.name);

  @OnQueueEvent('active')
  onActive(job: { jobId: string; prev?: string }) {
    this.logger.debug(`Processing escalation job with id ${job.jobId}...`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string; prev?: string }) {
    this.logger.debug(`Escalation job with id ${job.jobId} completed`);
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string; prev?: string }) {
    this.logger.error(`Escalation job with id ${job.jobId} failed`);
  }
}
