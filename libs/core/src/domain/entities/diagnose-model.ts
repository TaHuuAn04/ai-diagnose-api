import { AIDiagnosisResultEntity } from './ai-diagnosis-result';
import { BaseEntity } from './base';

export class DiagnoseModelEntity extends BaseEntity {
  version: string;

  name?: string | null;

  isPublic: boolean;

  keyModel: string;

  modelUrl: string;

  results?: AIDiagnosisResultEntity[] | [];
}
