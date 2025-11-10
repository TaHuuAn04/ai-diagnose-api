import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Job } from 'bullmq';

import { AiInternalServerError } from '@app/core/exception';

import { ProcessSendSupportEscalationTicketCommand } from '../use-cases';

import { ESCALATION_QUEUE, EscalationJobData } from '.';

@Processor(ESCALATION_QUEUE.NAME, {
  concurrency: 1,
  limiter: {
    max: 10,
    duration: 1000,
  },
})
export class EscalationQueueConsumer extends WorkerHost {
  private readonly logger = new Logger(EscalationQueueConsumer.name);

  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  async process(job: Job<EscalationJobData>): Promise<void> {
    try {
      switch (job.name) {
        case ESCALATION_QUEUE.JOBS.SEND_SUPPORT_TICKET_EMAIL:
          await this.commandBus.execute(
            new ProcessSendSupportEscalationTicketCommand(job.data),
          );
          break;

        default:
          throw new AiInternalServerError(`Invalid job name: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(error);
      throw new AiInternalServerError(
        (error?.message ?? 'Failed to process escalation job') as string,
      );
    }
  }
}
