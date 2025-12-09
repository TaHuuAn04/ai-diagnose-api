import { BaseEntity } from './base';
import { ChatHistoryEntity } from './chat-history';

export class ChatbotQueryEntity extends BaseEntity {
  parentId: string;

  historyId: string;

  query: string;

  response?: string | null;

  parent?: ChatbotQueryEntity | null;

  history?: ChatHistoryEntity | null;
}
