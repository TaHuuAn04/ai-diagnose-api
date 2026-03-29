import { SeverityLevel } from '../enums';

import { AIResultDiseaseEntity } from './ai-result-disease';
import { BaseEntity } from './base';
import { ConsultationEntity } from './consultation';
import { DiagnoseModelEntity } from './diagnose-model';

export interface SuggestedDiagnosis {
  diseaseName: string;
  accuracy: number;
}

export class AIDiagnosisResultEntity extends BaseEntity {
  consultationId: string;

  diagnoseModelId: string;

  suggestedDiagnosis: SuggestedDiagnosis[];

  proof?: string | null;

  aiAdvice?: string | null;

  severityLevel?: SeverityLevel | null;

  consultation?: ConsultationEntity | null;

  generateBy?: DiagnoseModelEntity | null;

  diseases?: AIResultDiseaseEntity[] | [];
}
