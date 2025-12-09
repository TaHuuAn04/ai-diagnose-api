import { ScheduleEntity } from './schedule';
import { UserEntity } from './user';

export class AdmissionStaffEntity {
  userId: string;

  staffCode: string;

  department: string;

  description?: string | null;

  user?: UserEntity | null;

  schedule?: ScheduleEntity[] | null;
}
