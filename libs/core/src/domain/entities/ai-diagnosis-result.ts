import { SeverityLevel } from '../enums';

import { AIResultDiseaseEntity } from './ai-result-disease';
import { BaseEntity } from './base';
import { ConsultationEntity } from './consultation';
import { DiagnoseModelEntity } from './diagnose-model';

export class AIDiagnosisResultEntity extends BaseEntity {
  consultationId: string;

  diagnoseModelId: string;

  suggestedDiagnosis: string;

  proof?: string | null;

  severityLevel: SeverityLevel;

  consultation?: ConsultationEntity | null;

  generateBy?: DiagnoseModelEntity | null;

  diseases?: AIResultDiseaseEntity[] | [];
}
