import { AiProviderType } from '@app/core/domain/enums';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ModelConfigDto {
  @IsEnum(AiProviderType)
  @IsNotEmpty()
  providerType: AiProviderType;

  @IsString()
  @IsNotEmpty()
  nameModel: string;

  @IsOptional()
  accessToken?: string;
}

export class ProcessAiDiagnosisInputDto {
  @IsString()
  @IsNotEmpty()
  consultationId: string;

  @IsUUID()
  @IsNotEmpty()
  diagnoseModelId: string;

  @IsOptional()
  modelConfig: ModelConfigDto;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageBase64: string;
}

export class ProcessAiDiagnosisResponseDto {
  result: boolean;
}
