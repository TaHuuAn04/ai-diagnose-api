import { DiagnosisResultEntity } from './diagnosis-result';
import { DiseaseEntity } from './disease';

export class ResultDiseaseEntity {
  resultId: string;

  diseaseId: string;

  disease?: DiseaseEntity | null;

  result?: DiagnosisResultEntity | null;
}
