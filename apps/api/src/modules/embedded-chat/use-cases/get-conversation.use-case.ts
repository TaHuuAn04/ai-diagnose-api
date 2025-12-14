import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@app/core/dtos';

import { DifyEmbeddedChatService } from '../../dify-ai/dify-embedded-chat.service';
import {
  EmbeddedChatConversationItemDto,
  GetEmbeddedChatConversationInputDto,
} from '../dtos';

export class GetEmbeddedChatConversationQuery implements IQuery {
  constructor(public readonly input: GetEmbeddedChatConversationInputDto) {}
}

@QueryHandler(GetEmbeddedChatConversationQuery)
export class GetEmbeddedChatConversationQueryHandler
  implements
    IQueryHandler<
      GetEmbeddedChatConversationQuery,
      PaginatedResult<EmbeddedChatConversationItemDto>
    >
{
  constructor(
    private readonly difyEmbeddedChatService: DifyEmbeddedChatService,
  ) {}

  async execute(
    query: GetEmbeddedChatConversationQuery,
  ): Promise<PaginatedResult<EmbeddedChatConversationItemDto>> {
    const { input } = query;

    const response = await this.difyEmbeddedChatService.getConversation({
      query: input,
      token: input.token,
    });

    return {
      data: response.data,
      total: response.data.length,
    };
  }
}
