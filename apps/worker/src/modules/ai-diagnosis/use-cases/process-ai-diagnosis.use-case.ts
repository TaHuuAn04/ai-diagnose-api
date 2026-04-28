import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { ChatMessageBlockDifyAiCommand, GetPassportDifyAiCommand } from 'apps/api/src/modules/dify-ai/use-cases';
import { lastValueFrom } from 'rxjs';

import { AiProviderType } from '@app/core/domain/enums';
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
  private readonly logger = new Logger(ProcessAiDiagnosisCommandHandler.name);
  constructor(
    private readonly aiDiagnosisHttpService: AiDiagnosisHttpService,
    private readonly httpService: HttpService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: ProcessAiDiagnosisCommand): Promise<void> {
    try {
      const { input } = command;
      
      const providerType = input.modelConfig?.providerType || AiProviderType.INTERNAL;
      
      let disease: string;
      let probability: number;
      let aiAdvice: string;
      let imageWithBbox: string | undefined;
      let croppedImage: string | undefined;

      if (providerType === AiProviderType.INTERNAL) {
        this.logger.log(`Using INTERNAL AI service for consultation ${input.consultationId}`);
        const aiResponse = await this.aiDiagnosisHttpService.callFullFlow({
          description: input.description,
          imageBase64: input.imageBase64,
        });
        disease = aiResponse.full_flow_result.vision_analysis.top_prediction.disease;
        probability = aiResponse.full_flow_result.vision_analysis.top_prediction.percentage;
        aiAdvice = aiResponse.full_flow_result.ai_advice;
        imageWithBbox = aiResponse.full_flow_result.vision_analysis.image_with_bbox_base64;
        croppedImage = aiResponse.full_flow_result.vision_analysis.cropped_image_base64;
      } else if (providerType === AiProviderType.DIFY) {
        this.logger.log(`Using DIFY RAG for consultation ${input.consultationId}`);
        const visionResponse = await this.aiDiagnosisHttpService.callVisionOnly({
          imageBase64: input.imageBase64,
        });
        disease = visionResponse.data.top_prediction.disease;
        probability = visionResponse.data.top_prediction.percentage;
        imageWithBbox = visionResponse.data.image_with_bbox_base64;
        croppedImage = visionResponse.data.cropped_image_base64;

        // 2. Call Dify CQRS Command
        const accessToken = input.modelConfig?.accessToken;
        if (!accessToken) {
          throw new Error('Dify accessToken (x-app-code) is missing in model config');
        }

        // 2.a Get Passport Token
        const passportResponse = await this.commandBus.execute(
          new GetPassportDifyAiCommand({
            headers: { 'x-app-code': accessToken },
            query: { user_id: 'system-worker' },
          })
        );
        
        const passportToken = passportResponse.access_token;
        if (!passportToken) {
          throw new Error('Failed to get Dify passport token');
        }

        // 2.b Get Chat Message Blocking
        const chatResponse = await this.commandBus.execute(
          new ChatMessageBlockDifyAiCommand({
            token: passportToken,
            appCode: accessToken,
            body: {
              query: 'Xin hãy phân tích và tư vấn cho ca bệnh này.',
              inputs: {
                description: input.description,
                top_disease: disease,
                confidence: probability,
              },
              response_mode: 'blocking',
            },
          })
        );

        aiAdvice = chatResponse.answer || 'Không thể lấy lời khuyên từ AI lúc này.';
      } else {
        throw new Error(`Unsupported AI Provider Type: ${providerType}`);
      }

      // Call API callback to save DB
      const resultPayload = {
        consultationId: input.consultationId,
        diagnoseModelId: input.diagnoseModelId,
        disease,
        probability,
        aiAdvice,
        imageWithBbox,
        croppedImage,
      };

      const url = `${API_CALLBACK_BASE_URL}/doctors/ai-diagnosis/callback`;
      await lastValueFrom(
        this.httpService.post(url, resultPayload),
      );
      
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }
      this.logger.error(`Error processing AI diagnosis: ${error?.message}`);

      throw new AiInternalServerError(
        (error?.message || 'Error processing AI diagnosis') as string,
      );
    }
  }
}

