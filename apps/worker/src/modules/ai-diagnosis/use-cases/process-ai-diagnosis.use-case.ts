import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { lastValueFrom } from 'rxjs';

import { API_CALLBACK_BASE_URL } from '@app/core/environments';
import { AiInternalServerError, Exception } from '@app/core/exception';

import { AiDiagnosisHttpService } from '../infrastructures/ai-diagnosis-http.service';
import { AiDiagnosisJobData } from '../queues';

export class ProcessAiDiagnosisCommand implements ICommand {
  constructor(public readonly input: AiDiagnosisJobData) {}
}

@CommandHandler(ProcessAiDiagnosisCommand)
export class ProcessAiDiagnosisCommandHandler
  implements ICommandHandler<ProcessAiDiagnosisCommand, void>
{
  constructor(
    private readonly aiDiagnosisHttpService: AiDiagnosisHttpService,
    private readonly httpService: HttpService,
  ) {}

  async execute(command: ProcessAiDiagnosisCommand): Promise<void> {
    try {
      const { input } = command;

      // 1. Call AI Service
      const aiResponse = await this.aiDiagnosisHttpService.callFullFlow({
        description: input.description,
        imageBase64: input.imageBase64,
      });

      // 2. Call API callback to save DB
      const resultPayload = {
        consultationId: input.consultationId,
        diagnoseModelId: input.diagnoseModelId,
        disease: aiResponse.full_flow_result.vision_analysis.top_prediction.disease,
        probability: aiResponse.full_flow_result.vision_analysis.top_prediction.percentage,
        aiAdvice: aiResponse.full_flow_result.ai_advice,
      };

      const url = `${API_CALLBACK_BASE_URL}/api/doctors/ai-diagnosis/callback`;
      await lastValueFrom(
        this.httpService.post(url, resultPayload),
      );
      
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AiInternalServerError(
        (error?.message || 'Error processing AI diagnosis') as string,
      );
    }
  }
}
