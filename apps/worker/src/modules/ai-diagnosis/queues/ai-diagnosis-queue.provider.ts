import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Job, Queue } from 'bullmq';

import { ProcessAiDiagnosisInputDto } from '../dtos';

import { AI_DIAGNOSIS_QUEUE, AiDiagnosisJobData } from '.';

@Injectable()
export class AiDiagnosisQueueProvider {
  constructor(
    @InjectQueue(AI_DIAGNOSIS_QUEUE.NAME)
    private readonly aiDiagnosisQueue: Queue<AiDiagnosisJobData>,
  ) {}

  async processFullFlow(
    input: ProcessAiDiagnosisInputDto,
  ): Promise<Job<AiDiagnosisJobData>> {
    return this.aiDiagnosisQueue.add(
      AI_DIAGNOSIS_QUEUE.JOBS.PROCESS_FULL_FLOW,
      input,
    );
  }
}
