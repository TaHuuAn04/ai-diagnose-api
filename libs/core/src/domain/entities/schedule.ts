import { AdmissionStaffEntity } from './admission-staff';
import { BaseEntity } from './base';
import { DoctorEntity } from './doctor';

export class ScheduleEntity extends BaseEntity {
  doctorId: string;

  admissionStaffId: string;

  date: string;

  from: string;

  to: string;

  room: string;

  doctor?: DoctorEntity | null;

  uploadBy?: AdmissionStaffEntity | null;
}
