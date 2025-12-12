import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { UserEntity } from '@app/core/domain/entities';
import { AiInternalServerError, Exception } from '@app/core/exception';

import { User } from '../../infrastructure/database/typeorm-nest/entities';

import {
  DocumentDifyAiDto,
  KnowledgeDifyAiResponseDto,
} from './dtos/console-api';
import { GetKnowledgeDifyAiCommand } from './use-cases/console-api';
import { RenameDocumentDifyAiCommand } from './use-cases/console-api/rename-document.use-case';
import { SetKnowledgeDocumentStatusDifyAiCommand } from './use-cases/console-api/set-knowledge-document-status.use-case';

@Injectable()
export class DifyKnowledgeService {
  constructor(private readonly commandBus: CommandBus) {}

  async getKnowledgeByDatasetId(
    user: User,
    datasetId: string,
  ): Promise<KnowledgeDifyAiResponseDto> {
    try {
      const command = new GetKnowledgeDifyAiCommand(user, {
        id: datasetId,
      });

      return await this.commandBus.execute(command);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AiInternalServerError(
        (error.message ?? 'Error getting knowledge by dataset id') as string,
      );
    }
  }

  async renameKnowledgeDocument(
    user: UserEntity,
    knowledgeId: string,
    documentId: string,
    name: string,
  ): Promise<DocumentDifyAiDto> {
    try {
      const dto = new RenameDocumentDifyAiCommand(user, {
        params: {
          knowledge_id: knowledgeId,
          document_id: documentId,
        },
        body: {
          name,
        },
      });
      return await this.commandBus.execute(dto);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AiInternalServerError(
        (error.message ?? 'Error renaming knowledge document') as string,
      );
    }
  }

  async setKnowledgeDocumentStatus(
    user: UserEntity,
    knowledgeId: string,
    documentId: string,
    isEnabled: boolean,
  ): Promise<unknown> {
    try {
      const dto = new SetKnowledgeDocumentStatusDifyAiCommand(user, {
        params: {
          knowledge_id: knowledgeId,
          document_id: documentId,
        },
        isEnabled,
      });
      return await this.commandBus.execute(dto);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AiInternalServerError(
        (error.message ?? 'Error renaming knowledge document') as string,
      );
    }
  }
}
