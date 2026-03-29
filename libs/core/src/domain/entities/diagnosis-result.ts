import { BaseEntity } from './base';
import { ConsultationEntity } from './consultation';
import { ResultDiseaseEntity } from './result-disease';

export interface PrescriptionItem {
  medicineName: string;
  concentration: string;
  quantity: string;
  dosage: string;
  durationDays: number;
}

export class DiagnosisResultEntity extends BaseEntity {
  advices?: string | null;

  prescription?: PrescriptionItem[] | null;

  description?: string | null;

  feedBackAI?: string | null;

  symstomsText: string;

  consultationId: string;

  consultation?: ConsultationEntity | null;

  diseases?: ResultDiseaseEntity[] | [];
}
