import { BaseEntity } from './base';

export class ChatConversationEntity extends BaseEntity {
  conversationId: string;

  messageId: string;

  aiId: string;

  userInteractId: string;
}
