import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';

import { AiInternalServerError } from '@app/core/exception';

import { AiServiceConfig } from '../../../configs';

export interface FullFlowResponseDto {
  status: string;
  message?: string;
  full_flow_result: {
    vision_analysis: {
      status: string;
      message?: string;
      top_prediction?: {
        disease: string;
        percentage: number;
        severity: string;
      };
      image_with_bbox_base64?: string;
      cropped_image_base64?: string;
    };
    ai_advice: string;
  };
}

export interface VisionOnlyResponseDto {
  status: string;
  message?: string;
  data: {
    status?: string;
    message?: string;
    top_prediction?: {
      disease: string;
      percentage: number;
      severity: string;
    };
    image_with_bbox_base64?: string;
    cropped_image_base64?: string;
  };
}

@Injectable()
export class AiDiagnosisHttpService {
  private readonly logger = new Logger(AiDiagnosisHttpService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(AiServiceConfig.KEY)
    private readonly aiServiceConfig: ConfigType<typeof AiServiceConfig>,
  ) {}

  async callFullFlow(params: {
    description: string;
    imageBase64: string;
  }): Promise<FullFlowResponseDto> {
    try {
      const formData = new FormData();
      formData.append('description', params.description);
      
      const buffer = Buffer.from(params.imageBase64, 'base64');
      formData.append('file', buffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg',
      });

      const url = `${this.aiServiceConfig.baseUrl}/api/v1/model-ai/full-flow`;
      
      const response = await lastValueFrom(
        this.httpService.post<FullFlowResponseDto>(url, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error calling AI service full flow: ${error?.message}`);
      throw new AiInternalServerError('Failed to call AI service full flow');
    }
  }

  async callVisionOnly(params: {
    imageBase64: string;
  }): Promise<VisionOnlyResponseDto> {
    try {
      const formData = new FormData();
      
      const buffer = Buffer.from(params.imageBase64, 'base64');
      formData.append('file', buffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg',
      });

      const url = `${this.aiServiceConfig.baseUrl}/api/v1/model-ai/vision`;
      
      const response = await lastValueFrom(
        this.httpService.post<VisionOnlyResponseDto>(url, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error calling AI service vision only: ${error?.message}`);
      throw new AiInternalServerError('Failed to call AI service vision only');
    }
  }
}
