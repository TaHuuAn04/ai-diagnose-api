import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { v5 as uuidv5 } from 'uuid';

import { PaginatedResult } from '@app/core/dtos';
import { AiInternalServerError, Exception } from '@app/core/exception';

import { DifyEmbeddedChatService } from '../../dify-ai/dify-embedded-chat.service';
import {
  EmbeddedChatMessageItemDto,
  GetEmbeddedChatMessagesByConversationIdInputDto,
} from '../dtos';

export class GetEmbeddedChatMessagesByConversationIdQuery implements IQuery {
  constructor(
    public readonly input: GetEmbeddedChatMessagesByConversationIdInputDto,
  ) {}
}

@QueryHandler(GetEmbeddedChatMessagesByConversationIdQuery)
export class GetEmbeddedChatMessagesByConversationIdQueryHandler
  implements
    IQueryHandler<
      GetEmbeddedChatMessagesByConversationIdQuery,
      PaginatedResult<EmbeddedChatMessageItemDto>
    >
{
  // TODO: Implement the middleware service file
  constructor(
    private readonly difyEmbeddedChatService: DifyEmbeddedChatService,
  ) {}

  async execute(
    query: GetEmbeddedChatMessagesByConversationIdQuery,
  ): Promise<PaginatedResult<EmbeddedChatMessageItemDto>> {
    try {
      const { token, conversation_id, take, page } = query.input;

      const difyResponse =
        await this.difyEmbeddedChatService.getMessagesByConversationIdPagination(
          {
            token,
            query: {
              conversation_id,
              limit: take,
              page,
            },
          },
        );

      return {
        data: difyResponse.data.flatMap((message) => [
          {
            id: uuidv5(message.id, uuidv5.URL),
            message: message.query,
            type: 'sent',
          },
          {
            id: message.id,
            message: message.answer,
            type: 'received',
          },
        ]),
        total: difyResponse.total,
      };
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AiInternalServerError(
        (error.message ||
          'Error fetching messages by conversation ID') as string,
      );
    }
  }
}
