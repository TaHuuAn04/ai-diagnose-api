import { BaseEntity } from './base';
import { ChatConversationEntity } from './chat-conversation';

export class UserInteractEntity extends BaseEntity {
  userRefId: string;

  displayName: string;

  typeUser: string;

  userIdByApp: string;

  conversation?: ChatConversationEntity;
}
