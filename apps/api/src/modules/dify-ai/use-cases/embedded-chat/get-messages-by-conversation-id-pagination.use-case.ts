import { HttpService } from '@nestjs/axios';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  GetMessagesByConversationIdPaginationDifyAiDto,
  GetMessagesByConversationIdPaginationDifyAiInputDto,
  GetMessagesByConversationIdPaginationDifyAiResponseDto,
} from '../../dtos';

export class GetMessagesByConversationIdPaginationDifyAiQuery
  implements IQuery
{
  constructor(
    public readonly input: GetMessagesByConversationIdPaginationDifyAiInputDto,
  ) {}
}

@QueryHandler(GetMessagesByConversationIdPaginationDifyAiQuery)
export class GetMessagesByConversationIdPaginationDifyAiQueryHandler
  implements
    IQueryHandler<
      GetMessagesByConversationIdPaginationDifyAiQuery,
      GetMessagesByConversationIdPaginationDifyAiResponseDto
    >
{
  constructor(private readonly httpService: HttpService) {}

  async execute(query: GetMessagesByConversationIdPaginationDifyAiQuery) {
    try {
      const dto = new GetMessagesByConversationIdPaginationDifyAiDto(
        query.input.query,
      );
      const response =
        await fetchDto<GetMessagesByConversationIdPaginationDifyAiResponseDto>({
          httpService: this.httpService,
          headers: new AxiosHeaders({
            Authorization: `Bearer ${query.input.token}`,
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
        'Error fetching messages by conversation ID with pagination from Dify AI'
      );
    }
  }
}
