import { BaseEntity } from './base';
import { ChatHistoryEntity } from './chat-history';

export class ChatbotEntity extends BaseEntity {
  version: string;

  name?: string | null;

  isPublic: boolean;

  accessToken: string;

  knowledgeName?: string | null;

  knowledgeUrl: string;

  model_config: unknown;

  history?: ChatHistoryEntity[] | [];
}
