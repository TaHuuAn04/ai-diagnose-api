import { AiProviderType } from '@app/core/domain/enums';
import { Expose } from 'class-transformer';

export class ModelConfigResponseDto {
  @Expose()
  providerType: AiProviderType;

  @Expose()
  nameModel: string;

  @Expose()
  accessToken: string;
}

export class DiagnoseModelResponseDto {
  @Expose()
  id: string;

  @Expose()
  version: string;

  @Expose()
  name: string;

  @Expose()
  isPublic: boolean;

  @Expose()
  modelConfig: ModelConfigResponseDto;

  @Expose()
  modelUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
