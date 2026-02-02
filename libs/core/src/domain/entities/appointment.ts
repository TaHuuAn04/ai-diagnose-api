import { AppointmentStatus } from '../enums';

import { BaseEntity } from './base';
import { PatientEntity } from './patient';
import { WorkingTimeEntity } from './working-time';

export class AppointmentEntity extends BaseEntity {
  description?: string | null;

  status: AppointmentStatus;

  patientId: string;

  patient?: PatientEntity | null;

  workingTime?: WorkingTimeEntity | null;
}
