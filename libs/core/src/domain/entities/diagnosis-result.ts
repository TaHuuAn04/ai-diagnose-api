import { BaseEntity } from './base';
import { ConsultationEntity } from './consultation';
import { ResultDiseaseEntity } from './result-disease';

export class DiagnosisResultEntity extends BaseEntity {
  advices?: string | null;

  prescription?: string | null;

  symstomsText: string;

  consultationId: string;

  consultation?: ConsultationEntity | null;

  diseases?: ResultDiseaseEntity[] | null;
}
