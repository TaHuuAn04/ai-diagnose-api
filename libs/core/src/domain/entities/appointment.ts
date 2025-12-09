import { AppointmentStatus } from '../enums';

import { BaseEntity } from './base';
import { DoctorEntity } from './doctor';
import { ImageEntity } from './image';
import { PatientEntity } from './patient';
import { ShiftEntity } from './shift';

export class AppointmentEntity extends BaseEntity {
  description?: string | null;

  status: AppointmentStatus;

  shiftId: string;

  patientId: string;

  doctorId: string;

  shift?: ShiftEntity | null;

  image?: ImageEntity[] | null;

  patient?: PatientEntity | null;

  doctor?: DoctorEntity | null;
}
