import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { ChatMessageBlockDifyAiCommand, GetPassportDifyAiCommand } from 'apps/api/src/modules/dify-ai/use-cases';
import { lastValueFrom } from 'rxjs';

import { AiProviderType } from '@app/core/domain/enums';
import { API_CALLBACK_BASE_URL } from '@app/core/environments';
import { AiInternalServerError, Exception } from '@app/core/exception';

import { AiDiagnosisHttpService, LesionResult } from '../infrastructures/ai-diagnosis-http.service';
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
      let severityLevel: string | undefined;
      let aiAdvice = 'Không có lời khuyên từ AI.';
      let imageWithAllBboxes: string = input.imageBase64;
      let lesions: LesionResult[] = [];

      if (providerType === AiProviderType.INTERNAL) {
        this.logger.log(`Using INTERNAL AI service for consultation ${input.consultationId}`);
        const aiResponse = await this.aiDiagnosisHttpService.callFullFlow({
          description: input.description,
          imageBase64: input.imageBase64,
        });

        const visionAnalysis = aiResponse.full_flow_result?.vision_analysis;

        if (visionAnalysis?.status === 'success') {
          imageWithAllBboxes = visionAnalysis.image_with_all_bboxes_base64
            || visionAnalysis.image_with_bbox_base64
            || input.imageBase64;

          if (visionAnalysis.lesions?.length) {
            lesions = visionAnalysis.lesions;
            disease = lesions[0].top_prediction.disease;
            probability = lesions[0].top_prediction.percentage;
            severityLevel = lesions[0].top_prediction.severity;
          } else if (visionAnalysis.top_prediction) {
            // fallback: single-lesion response từ model cũ
            disease = visionAnalysis.top_prediction.disease;
            probability = visionAnalysis.top_prediction.percentage;
            severityLevel = visionAnalysis.top_prediction.severity;
            lesions = [{
              index: 0,
              bounding_box: visionAnalysis.bounding_box as number[] || [],
              cropped_image_base64: visionAnalysis.cropped_image_base64 || input.imageBase64,
              top_prediction: visionAnalysis.top_prediction,
              all_predictions: visionAnalysis.all_predictions || [visionAnalysis.top_prediction],
            }];
          }
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

        if (visionResponse.status === 'success') {
          imageWithAllBboxes = visionData.image_with_all_bboxes_base64
            || visionData.image_with_bbox_base64
            || input.imageBase64;

          if (visionData.lesions?.length) {
            lesions = visionData.lesions;
            disease = lesions[0].top_prediction.disease;
            probability = lesions[0].top_prediction.percentage;
            severityLevel = lesions[0].top_prediction.severity;
          } else if (visionData.top_prediction) {
            disease = visionData.top_prediction.disease;
            probability = visionData.top_prediction.percentage;
            severityLevel = visionData.top_prediction.severity;
            lesions = [{
              index: 0,
              bounding_box: [],
              cropped_image_base64: visionData.cropped_image_base64 || input.imageBase64,
              top_prediction: visionData.top_prediction,
              all_predictions: visionData.all_predictions || [visionData.top_prediction],
            }];
          }
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
          const diseaseList = lesions.map((l, idx) => {
            const preds = l.all_predictions
              .map(p => `${p.disease} (${p.percentage}%)`)
              .join(', ');
            return `Tổn thương ${idx + 1}: ${preds}`;
          }).join('\n');

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
                  disease_list: diseaseList,
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
        severityLevel,
        aiAdvice,
        imageWithAllBboxes,
        lesions: lesions.map(l => ({
          lesionIndex: l.index,
          topDisease: l.top_prediction.disease,
          topProbability: l.top_prediction.percentage,
          severity: l.top_prediction.severity,
          croppedImage: l.cropped_image_base64,
          allPredictions: l.all_predictions.map(p => ({
            disease: p.disease,
            probability: p.percentage,
            severity: p.severity,
          })),
        })),
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

