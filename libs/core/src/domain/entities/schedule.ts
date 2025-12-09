import { AdmissionStaffEntity } from './admission-staff';
import { BaseEntity } from './base';

export class ScheduleEntity extends BaseEntity {
  admissionStaffId: string;

  date: string;

  from: string;

  to: string;

  uploadBy?: AdmissionStaffEntity | null;
}
