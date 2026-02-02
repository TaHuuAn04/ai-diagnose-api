import { AppointmentEntity } from './appointment';
import { BaseEntity } from './base';
import { DoctorEntity } from './doctor';
import { PatientEntity } from './patient';

export class ConsultationEntity extends BaseEntity {
  appointmentId: string;

  patientId: string;

  doctorId: string;

  appointment?: AppointmentEntity | null;

  patient?: PatientEntity | null;

  doctor?: DoctorEntity | null;
}
