import { AIResultDiseaseEntity } from './ai-result-disease';
import { BaseEntity } from './base';
import { DataInstanceEntity } from './data-instance';
import { ResultDiseaseEntity } from './result-disease';

export class DiseaseEntity extends BaseEntity {
  name: string;

  description?: string | null;

  datas?: DataInstanceEntity[] | null;

  results?: ResultDiseaseEntity[] | null;

  resultAIs?: AIResultDiseaseEntity[] | null;
}
