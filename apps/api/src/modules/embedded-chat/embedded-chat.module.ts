import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '../../common/enums';
import { DifyAiModule } from '../dify-ai/dify-ai.module';

import { EmbeddedChatController } from './embedded-chat.controller';
import { EmbeddedChatService } from './infrastructure/adapters/embedded-chat.service';
import {
  ChatMessageBlockCommandHandler,
  ChatMessageStreamCommandHandler,
  GetEmbeddedChatConversationQueryHandler,
  GetEmbeddedChatMessagesByConversationIdQueryHandler,
  GetEmbeddedChatPassportCommandHandler,
  UploadFileChatCommandHandler,
} from './use-cases';

const handlers = [
  GetEmbeddedChatMessagesByConversationIdQueryHandler,
  ChatMessageBlockCommandHandler,
  ChatMessageStreamCommandHandler,
  GetEmbeddedChatPassportCommandHandler,
  GetEmbeddedChatConversationQueryHandler,
  UploadFileChatCommandHandler,
];

const adapters = [
  {
    provide: INJECTION_TOKEN.EMBEDDED_CHAT_SERVICE,
    useClass: EmbeddedChatService,
  },
];

@Module({
  imports: [CqrsModule, DifyAiModule, HttpModule],
  controllers: [EmbeddedChatController],
  providers: [...handlers, ...adapters],
})
export class EmbeddedChatModule {}
