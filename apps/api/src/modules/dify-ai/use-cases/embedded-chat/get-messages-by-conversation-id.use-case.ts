import { HttpService } from '@nestjs/axios';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  GetMessagesByConversationIdDifyAiDto,
  GetMessagesByConversationIdDifyAiInputDto,
  GetMessagesByConversationIdDifyAiResponseDto,
} from '../../dtos';

export class GetMessagesByConversationIdDifyAiQuery implements IQuery {
  constructor(
    public readonly input: GetMessagesByConversationIdDifyAiInputDto,
  ) {}
}

@QueryHandler(GetMessagesByConversationIdDifyAiQuery)
export class GetMessagesByConversationIdDifyAiQueryHandler
  implements
    IQueryHandler<
      GetMessagesByConversationIdDifyAiQuery,
      GetMessagesByConversationIdDifyAiResponseDto
    >
{
  constructor(private readonly httpService: HttpService) {}

  async execute(input: GetMessagesByConversationIdDifyAiQuery) {
    try {
      const dto = new GetMessagesByConversationIdDifyAiDto(input.input.query);
      const response =
        await fetchDto<GetMessagesByConversationIdDifyAiResponseDto>({
          httpService: this.httpService,
          headers: new AxiosHeaders({
            Authorization: `Bearer ${input.input.token}`,
          }),
          dto,
        });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return response.data;
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error fetching messages by conversation ID from Dify AI'
      );
    }
  }
}
