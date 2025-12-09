import { BaseEntity } from './base';
import { DoctorEntity } from './doctor';
import { ScheduleEntity } from './schedule';

export class RoomEntity extends BaseEntity {
  room: string;

  doctorId: string;

  scheduleId: string;

  doctor?: DoctorEntity | null;

  schedule?: ScheduleEntity | null;
}
