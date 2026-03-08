import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { DifyAiConfig } from 'apps/api/src/config';

import { INJECTION_TOKEN } from '../../common/enums';
import { CacheService } from '../../infrastructure/cache';

import { DifyAiService } from './dify-ai.service';
import { DifyEmbeddedChatService } from './dify-embedded-chat.service';
import { DifyKnowledgeService } from './dify-knowledge.service';
import { DifyWorkflowService } from './dify-workflow.service';
import { DifyCacheService } from './infrastructures';
import {
  ChatMessageBlockDifyAiCommandHandler,
  ChatMessageStreamDifyAiCommandHandler,
  CreateAppDifyAiCommandHandler,
  DraftWorkflowDifyAiCommandHandler,
  GetAppByIdDifyAiCommandHandler,
  GetConversationByIdDifyAiQueryHandler,
  GetConversationDifyAiQueryHandler,
  GetConversationHistoryMessagesDifyCommandHandler,
  GetConversationsDifyCommandHandler,
  GetMessagesByConversationIdDifyAiQueryHandler,
  GetMessagesByConversationIdPaginationDifyAiQueryHandler,
  GetPassportDifyAiCommandHandler,
  LoginDifyAiCommandHandler,
  LoginWithoutPasswordDifyAiCommandHandler,
  PublishWorkflowDifyAiCommandHandler,
  UpdateAppModelConfigDifyAiCommandHandler,
  UploadFileChatDifyAiCommandHandler 
} from './use-cases';
import {
  CreateEmptyKnowledgeCommandHandler,
  DeleteKnowledgeDifyAiCommandHandler,
  DeleteKnowledgeDocumentDifyAiCommandHandler,
  GetKnowledgeDifyAiCommandHandler,
  GetKnowledgesDifyAiCommandHandler,
  InitKnowledgeDocumentDifyAiCommandHandler,
  UpdateKnowledgeDifyAiCommandHandler,
  UpdateKnowledgeDocumentDifyAiCommandHandler,
  UploadFileKnowledgeDifyAiCommandHandler,
} from './use-cases/console-api'
import { GetKnowledgesDocumentDifyAiCommandHandler } from './use-cases/console-api/get-knowledge-document.use-case';
import { RenameDocumentDifyAiCommandHandler } from './use-cases/console-api/rename-document.use-case';
import { SetKnowledgeDocumentStatusDifyAiCommandHandler } from './use-cases/console-api/set-knowledge-document-status.use-case';

const Adapters = [
  {
    provide: INJECTION_TOKEN.CACHE_SERVICE,
    useClass: CacheService,
  },
  {
    provide: INJECTION_TOKEN.DIFY_CACHE_SERVICE,
    useClass: DifyCacheService,
  },
];

const handlers = [
  CreateAppDifyAiCommandHandler,
  UpdateAppModelConfigDifyAiCommandHandler,
  ChatMessageBlockDifyAiCommandHandler,
  ChatMessageStreamDifyAiCommandHandler,
  UploadFileChatDifyAiCommandHandler,
  LoginWithoutPasswordDifyAiCommandHandler,
  GetAppByIdDifyAiCommandHandler,
  GetConversationDifyAiQueryHandler,
  GetPassportDifyAiCommandHandler,
  GetMessagesByConversationIdDifyAiQueryHandler,
  GetMessagesByConversationIdPaginationDifyAiQueryHandler,
  LoginDifyAiCommandHandler,
  CreateEmptyKnowledgeCommandHandler,
  GetKnowledgesDifyAiCommandHandler,
  GetKnowledgeDifyAiCommandHandler,
  UpdateKnowledgeDifyAiCommandHandler,
  DeleteKnowledgeDifyAiCommandHandler,
  UploadFileKnowledgeDifyAiCommandHandler,
  InitKnowledgeDocumentDifyAiCommandHandler,
  UpdateKnowledgeDocumentDifyAiCommandHandler,
  DraftWorkflowDifyAiCommandHandler,
  PublishWorkflowDifyAiCommandHandler,
  GetKnowledgesDocumentDifyAiCommandHandler,
  DeleteKnowledgeDocumentDifyAiCommandHandler,
  GetConversationHistoryMessagesDifyCommandHandler,
  GetConversationsDifyCommandHandler,
  RenameDocumentDifyAiCommandHandler,
  SetKnowledgeDocumentStatusDifyAiCommandHandler,
  GetConversationByIdDifyAiQueryHandler,
];

@Module({
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      inject: [DifyAiConfig.KEY],
      useFactory: (config: ConfigType<typeof DifyAiConfig>) => {
        return {
          baseURL: config.baseUrl,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [
    ...Adapters,
    ...handlers,
    DifyAiService,
    DifyWorkflowService,
    DifyEmbeddedChatService,
    DifyKnowledgeService,
    // DifyCacheService,
  ],
  exports: [
    DifyAiService,
    DifyWorkflowService,
    DifyEmbeddedChatService,
    DifyKnowledgeService,
    // DifyCacheService,
  ],
})
export class DifyAiModule {}
