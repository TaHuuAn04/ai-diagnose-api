import { AppointmentStatus } from '../enums';

import { BaseEntity } from './base';
import { ImageEntity } from './image';
import { PatientEntity } from './patient';
import { WorkingTimeEntity } from './working-time';

export class AppointmentEntity extends BaseEntity {
  description?: string | null;

  status: AppointmentStatus;

  patientId: string;

  image?: ImageEntity[] | [];

  patient?: PatientEntity | null;

  workingTime?: WorkingTimeEntity | null;
}
