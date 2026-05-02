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

export interface ClinicalInfo {
  symptom?: string;
  location?: string;
  duration?: string;
  skinType?: string[];
  skinTypeNote?: string;
  severity?: string;
  allergy?: string;
  history?: string;
  gender?: string;
  age?: number;
  genetic?: string;
}

export class DiagnosisResultEntity extends BaseEntity {
  advices?: string | null;

  prescription?: PrescriptionItem[] | null;

  description?: string | null;

  department?: string | null;

  feedBackAI?: string | null;

  symstomsText: string;

  clinicalInfo?: ClinicalInfo | null;

  consultationId: string;

  consultation?: ConsultationEntity | null;

  diseases?: ResultDiseaseEntity[] | [];
}
