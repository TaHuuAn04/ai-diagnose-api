import { AppointmentEntity } from './appointment';
import { ConsultationEntity } from './consultation';
import { UserEntity } from './user';

export class DoctorEntity {
  userId: string;

  doctorCode: string;

  department: string;

  experience?: string | null;

  description?: string | null;

  user?: UserEntity | null;

  appointment?: AppointmentEntity[] | null;

  consultation?: ConsultationEntity[] | null;
}
