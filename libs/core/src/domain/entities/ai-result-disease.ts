import { AIDiagnosisResultEntity } from './ai-diagnosis-result';
import { DiseaseEntity } from './disease';

export class AIResultDiseaseEntity {
  resultId: string;

  diseaseId: string;

  disease?: DiseaseEntity | null;

  result?: AIDiagnosisResultEntity | null;
}
