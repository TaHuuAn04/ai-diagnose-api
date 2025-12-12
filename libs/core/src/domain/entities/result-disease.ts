import { BaseEntityWithoutId } from './base';
import { DiagnosisResultEntity } from './diagnosis-result';
import { DiseaseEntity } from './disease';

export class ResultDiseaseEntity extends BaseEntityWithoutId {
  resultId: string;

  diseaseId: string;

  name: string;

  disease?: DiseaseEntity | null;

  result?: DiagnosisResultEntity | null;
}
