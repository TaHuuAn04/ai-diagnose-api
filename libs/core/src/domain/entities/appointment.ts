import { AppointmentStatus } from '../enums';

import { BaseEntity } from './base';
import { PatientEntity } from './patient';
import { WorkingTimeEntity } from './working-time';

export class AppointmentMetadata {
  doctorId: string;

  doctorName: string;

  department: string;

  date: string;

  from: string;	

  to: string;

  room: string;
}

export class AppointmentEntity extends BaseEntity {
  description?: string | null;

  status: AppointmentStatus;

  patientId: string;

  metadata?: AppointmentMetadata | null;

  patient?: PatientEntity | null;

  workingTime?: WorkingTimeEntity | null;

  note?: string | null;
}
