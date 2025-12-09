import { AppointmentEntity } from './appointment';
import { ChatHistoryEntity } from './chat-history';
import { ConsultationEntity } from './consultation';
import { UserEntity } from './user';

export class PatientEntity {
  userId: string;

  folk?: string | null;

  address?: string | null;

  citizenCode: string;

  medicalInsurance: string;

  user?: UserEntity | null;

  history?: ChatHistoryEntity[] | null;

  appointment?: AppointmentEntity[] | null;

  consultation?: ConsultationEntity[] | null;
}
