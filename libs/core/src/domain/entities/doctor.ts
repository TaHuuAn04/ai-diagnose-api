import { BaseEntityWithoutId } from './base';
import { ConsultationEntity } from './consultation';
import { ScheduleEntity } from './schedule';
import { UserEntity } from './user';
import { WorkingTimeEntity } from './working-time';

export class DoctorEntity extends BaseEntityWithoutId {
  userId: string;

  doctorCode: string;

  department: string;

  experience?: string | null;

  description?: string | null;

  user?: UserEntity | null;

  schedule?: ScheduleEntity[];

  workingTime?: WorkingTimeEntity[];

  consultation?: ConsultationEntity[];
}
