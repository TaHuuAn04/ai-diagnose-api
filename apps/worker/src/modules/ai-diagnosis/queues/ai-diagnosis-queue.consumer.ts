import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { Job } from 'bullmq';

import { AiInternalServerError } from '@app/core/exception';

import { ProcessAiDiagnosisCommand } from '../use-cases';

import { AI_DIAGNOSIS_QUEUE, AiDiagnosisJobData } from '.';

@Processor(AI_DIAGNOSIS_QUEUE.NAME, {
  concurrency: 1,
  limiter: {
    max: 5,
    duration: 1000,
  },
})
export class AiDiagnosisQueueConsumer extends WorkerHost {
  private readonly logger = new Logger(AiDiagnosisQueueConsumer.name);

  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  async process(job: Job<AiDiagnosisJobData>): Promise<void> {
    try {
      switch (job.name) {
        case AI_DIAGNOSIS_QUEUE.JOBS.PROCESS_FULL_FLOW:
          await this.commandBus.execute(
            new ProcessAiDiagnosisCommand(job.data),
          );
          break;

        default:
          throw new AiInternalServerError(`Invalid job name: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(error);
      throw new AiInternalServerError(
        (error?.message ?? 'Failed to process AI diagnosis job') as string,
      );
    }
  }
}
