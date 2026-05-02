import { Expose, Type } from 'class-transformer';

import { AiProviderType } from '@app/core/domain/enums';

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
  @Type(() => ModelConfigResponseDto)
  modelConfig: ModelConfigResponseDto;

  @Expose()
  modelUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
