import { BaseEntity } from './base';
import { ConsultationEntity } from './consultation';
import { ResultDiseaseEntity } from './result-disease';

export interface PrescriptionItem {
  name: string;
  concentration: string;
  quantity: string;
  dosage: string;
  duration: number;
}

export class DiagnosisResultEntity extends BaseEntity {
  advices?: string | null;

  prescription?: PrescriptionItem[] | null;

  description?: string | null;

  department?: string | null;

  feedBackAI?: string | null;

  symstomsText: string;

  consultationId: string;

  consultation?: ConsultationEntity | null;

  diseases?: ResultDiseaseEntity[] | [];
}
