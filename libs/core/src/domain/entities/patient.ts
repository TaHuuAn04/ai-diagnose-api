import { AppointmentEntity } from './appointment';
import { BaseEntityWithoutId } from './base';
import { ChatHistoryEntity } from './chat-history';
import { ConsultationEntity } from './consultation';
import { UserEntity } from './user';

export class PatientEntity extends BaseEntityWithoutId {
  userId: string;

  folk?: string | null;

  address?: string | null;

  citizenCode: string;

  medicalInsurance: string;

  user?: UserEntity | null;

  history?: ChatHistoryEntity[] | [];

  appointment?: AppointmentEntity[] | [];

  consultation?: ConsultationEntity[] | [];
}
