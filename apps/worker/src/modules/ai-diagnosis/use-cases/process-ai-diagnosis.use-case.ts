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
      
      let disease = 'Không xác định được tổn thương';
      let probability = 0;
      let aiAdvice = 'Không có lời khuyên từ AI.';
      let imageWithBbox: string = input.imageBase64;
      let croppedImage: string = input.imageBase64;

      if (providerType === AiProviderType.INTERNAL) {
        this.logger.log(`Using INTERNAL AI service for consultation ${input.consultationId}`);
        const aiResponse = await this.aiDiagnosisHttpService.callFullFlow({
          description: input.description,
          imageBase64: input.imageBase64,
        });

        const visionAnalysis = aiResponse.full_flow_result?.vision_analysis;
        
        if (visionAnalysis?.status === 'success' && visionAnalysis.top_prediction) {
          disease = visionAnalysis.top_prediction.disease || 'Unknown';
          probability = visionAnalysis.top_prediction.percentage || 0;
          imageWithBbox = visionAnalysis.image_with_bbox_base64 || input.imageBase64;
          croppedImage = visionAnalysis.cropped_image_base64 || input.imageBase64;
        } else {
          this.logger.warn(`INTERNAL AI vision warning: ${visionAnalysis?.message || 'No prediction'}`);
        }
        
        aiAdvice = aiResponse.full_flow_result?.ai_advice || 'Không có lời khuyên từ AI.';

      } else if (providerType === AiProviderType.DIFY) {
        this.logger.log(`Using DIFY RAG for consultation ${input.consultationId}`);
        const visionResponse = await this.aiDiagnosisHttpService.callVisionOnly({
          imageBase64: input.imageBase64,
        });

        const visionData = visionResponse.data;
        
        if (visionResponse.status === 'success' && visionData?.top_prediction) {
          disease = visionData.top_prediction.disease || 'Unknown';
          probability = visionData.top_prediction.percentage || 0;
          imageWithBbox = visionData.image_with_bbox_base64 || input.imageBase64;
          croppedImage = visionData.cropped_image_base64 || input.imageBase64;
        } else {
          this.logger.warn(`DIFY AI vision warning: ${visionResponse.message || 'No prediction'}`);
        }

        const accessToken = input.modelConfig?.accessToken || process.env.DIFY_AI_APP_ID;
        
        if (!accessToken) {
          throw new Error('Dify accessToken (x-app-code) is missing');
        }

        const passportResponse = await this.commandBus.execute(
          new GetPassportDifyAiCommand({
            headers: { 'x-app-code': accessToken },
            query: { user_id: `worker-${input.consultationId}` },
          })
        );
        
        const passportToken = passportResponse.access_token;
        if (!passportToken) {
          throw new Error('Failed to get Dify passport token');
        }

        try {
          const chatResponse = await this.commandBus.execute(
            new ChatMessageBlockDifyAiCommand({
              token: passportToken,
              appCode: accessToken,
              body: {
                query: 'Xin hãy phân tích và tư vấn cho ca bệnh này.',
                inputs: {
                  description: input.description || 'Không có mô tả',
                  top_disease: String(disease),
                  confidence: String(probability),
                },
                response_mode: 'blocking',
              },
            })
          );
          aiAdvice = chatResponse.answer || 'Không thể lấy lời khuyên từ AI lúc này.';
        } catch (difyError) {
          this.logger.error(`Dify Chat Error: ${difyError?.message}`);
          aiAdvice = 'Hệ thống DIFY đang gặp sự cố, không thể cung cấp lời khuyên.';
        }

      } else {
        throw new Error(`Unsupported AI Provider Type: ${providerType}`);
      }

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

