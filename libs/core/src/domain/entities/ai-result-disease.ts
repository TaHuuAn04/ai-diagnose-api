import { AIDiagnosisResultEntity } from './ai-diagnosis-result';
import { BaseEntityWithoutId } from './base';
import { DiseaseEntity } from './disease';

export class AIResultDiseaseEntity extends BaseEntityWithoutId {
  resultId: string;

  diseaseId: string;

  accuracy: number;

  disease?: DiseaseEntity | null;

  result?: AIDiagnosisResultEntity | null;
}
