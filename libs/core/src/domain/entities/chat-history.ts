import { BaseEntity } from './base';
import { ChatbotEntity } from './chatbot';
import { ChatbotQueryEntity } from './chatbot-query';
import { PatientEntity } from './patient';

export class ChatHistoryEntity extends BaseEntity {
  patientId: string;

  chatbotId: string;

  title: string;

  patient?: PatientEntity | null;

  chatbot?: ChatbotEntity | null;

  query?: ChatbotQueryEntity[] | [];
}
