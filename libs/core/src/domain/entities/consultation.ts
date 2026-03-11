import { AIDiagnosisResultEntity } from './ai-diagnosis-result';
import { AppointmentEntity } from './appointment';
import { BaseEntity } from './base';
import { DiagnosisResultEntity } from './diagnosis-result';
import { DoctorEntity } from './doctor';
import { PatientEntity } from './patient';

export class ConsultationEntity extends BaseEntity {
  appointmentId: string;

  patientId: string;

  doctorId: string;

  startTime: string | null;

  endTime: string | null;

  appointment?: AppointmentEntity | null;

  patient?: PatientEntity | null;

  doctor?: DoctorEntity | null;

  aiResult?: AIDiagnosisResultEntity | null;

  diagnosisResult?: DiagnosisResultEntity | null;
}
