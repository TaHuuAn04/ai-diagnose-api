import { AiProviderType } from '../enums';
import { AIDiagnosisResultEntity } from './ai-diagnosis-result';
import { BaseEntity } from './base';

export interface ModelConfig {
  providerType: AiProviderType;
  nameModel: string;
  accessToken?: string;
}

export class DiagnoseModelEntity extends BaseEntity {
  version: string;

  name?: string | null;

  isPublic: boolean;

  modelConfig: ModelConfig;

  modelUrl: string;

  results?: AIDiagnosisResultEntity[] | [];
}
