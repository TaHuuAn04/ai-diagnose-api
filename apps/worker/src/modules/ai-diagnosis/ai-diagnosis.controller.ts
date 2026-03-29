import { Body, Controller, Post } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import {
  ProcessAiDiagnosisInputDto,
  ProcessAiDiagnosisResponseDto,
} from './dtos';
import { AiDiagnosisQueueProvider } from './queues/ai-diagnosis-queue.provider';

@Controller('ai-diagnosis')
export class AiDiagnosisController {
  constructor(
    private readonly aiDiagnosisQueueProvider: AiDiagnosisQueueProvider,
  ) {}

  @Post('process')
  async process(
    @Body() body: ProcessAiDiagnosisInputDto,
  ): Promise<ProcessAiDiagnosisResponseDto> {
    await this.aiDiagnosisQueueProvider.processFullFlow(body);

    return plainToInstance(ProcessAiDiagnosisResponseDto, {
      result: true,
    });
  }
}
