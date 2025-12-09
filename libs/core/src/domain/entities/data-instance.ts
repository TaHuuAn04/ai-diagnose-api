import { BaseEntity } from './base';
import { DiseaseEntity } from './disease';

export class DataInstanceEntity extends BaseEntity {
  diseaseId: string;

  image_url: string;

  description?: string | null;

  disease?: DiseaseEntity | null;
}
