import { Expose } from 'class-transformer';

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
  keyModel: string;

  @Expose()
  modelUrl: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
