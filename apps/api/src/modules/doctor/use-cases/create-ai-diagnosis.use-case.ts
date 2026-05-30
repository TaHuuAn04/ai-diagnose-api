import { HttpService } from '@nestjs/axios';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';


import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAIDiagnosisResultRepository, IDiagnoseModelRepository } from '@api/repository';
import { lastValueFrom } from 'rxjs';

import { INTERNAL_WORKER_API_URL } from '@app/core/environments';
import { AiInternalServerError, Exception } from '@app/core/exception';

import { CreateAiDiagnosisRequestDto, CreateAiDiagnosisResponseDto } from '../dtos';

export class CreateAiDiagnosisCommand implements ICommand {
  constructor(
    public readonly payload: CreateAiDiagnosisRequestDto,
    public readonly imageBase64: string,
  ) {}
}

@CommandHandler(CreateAiDiagnosisCommand)
export class CreateAiDiagnosisCommandHandler
  implements ICommandHandler<CreateAiDiagnosisCommand, CreateAiDiagnosisResponseDto>
{
  private readonly logger = new Logger(CreateAiDiagnosisCommandHandler.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(REPOSITORY_INJECTION_TOKEN.DIAGNOSE_MODEL_REPOSITORY)
    private readonly diagnoseModelRepository: IDiagnoseModelRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.AI_DIAGNOSIS_RESULT_REPOSITORY)
    private readonly aiDiagnosisResultRepository: IAIDiagnosisResultRepository,
  ) {}

  async execute(
    command: CreateAiDiagnosisCommand,
  ): Promise<CreateAiDiagnosisResponseDto> {
    try {
      const { payload, imageBase64 } = command;

      // Clear any previous AI result so the FE polling gets 404 until the new job completes
      await this.aiDiagnosisResultRepository.deleteMany({ consultationId: payload.consultationId });

      // Find the default public model
      const defaultModel = await this.diagnoseModelRepository.findOne({
        where: { isPublic: true },
      });

      if (!defaultModel) {
        throw new AiInternalServerError('No default public AI model found in database');
      }

      const workerPayload = {
        consultationId: payload.consultationId,
        diagnoseModelId: defaultModel.id,
        modelConfig: defaultModel.modelConfig,
        description: payload.description,
        imageBase64,
      };

      const url = `${INTERNAL_WORKER_API_URL}/ai-diagnosis/process`;
      
      await lastValueFrom(this.httpService.post(url, workerPayload));

      return {
        jobId: `job-${payload.consultationId}`,
        status: 'processing',
      };
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }
      this.logger.error(`Error delegating AI diagnosis to worker: ${error?.message}`);
      throw new AiInternalServerError('Failed to create AI diagnosis job');
    }
  }
}
