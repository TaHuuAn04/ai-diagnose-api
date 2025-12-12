import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  GetConversationByIdDifyAiInputDto,
  GetConversationByIdDifyAiResponseDto,
  GetConversationDifyAiInputDto,
  GetConversationDifyAiResponseDto,
  GetMessagesByConversationIdPaginationDifyAiInputDto,
  GetMessagesByConversationIdPaginationDifyAiResponseDto,
  GetPassportDifyAiInputDto,
  GetPassportDifyAiResponseDto,
} from './dtos';
import {
  GetConversationByIdDifyAiQuery,
  GetConversationDifyAiQuery,
  GetMessagesByConversationIdPaginationDifyAiQuery,
  GetPassportDifyAiCommand,
} from './use-cases';

@Injectable()
export class DifyEmbeddedChatService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getPassport(
    input: GetPassportDifyAiInputDto,
  ): Promise<GetPassportDifyAiResponseDto> {
    const command = new GetPassportDifyAiCommand(input);
    return this.commandBus.execute(command);
  }

  async getConversation(
    input: GetConversationDifyAiInputDto,
  ): Promise<GetConversationDifyAiResponseDto> {
    const query = new GetConversationDifyAiQuery(input);
    return this.queryBus.execute(query);
  }

  async getMessagesByConversationIdPagination(
    input: GetMessagesByConversationIdPaginationDifyAiInputDto,
  ): Promise<GetMessagesByConversationIdPaginationDifyAiResponseDto> {
    const query = new GetMessagesByConversationIdPaginationDifyAiQuery(input);
    return this.queryBus.execute(query);
  }

  async getConversationDetails(
    input: GetConversationByIdDifyAiInputDto,
  ): Promise<GetConversationByIdDifyAiResponseDto> {
    const query = new GetConversationByIdDifyAiQuery(input);
    return this.queryBus.execute(query);
  }
}
