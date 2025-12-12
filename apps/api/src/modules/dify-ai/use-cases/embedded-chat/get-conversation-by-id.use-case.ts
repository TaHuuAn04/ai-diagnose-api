import { HttpService } from '@nestjs/axios';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  GetConversationByIdDifyAiDto,
  GetConversationByIdDifyAiInputDto,
  GetConversationByIdDifyAiResponseDto,
} from '../../dtos';

export class GetConversationByIdDifyAiQuery implements IQuery {
  constructor(public readonly input: GetConversationByIdDifyAiInputDto) {}
}

@QueryHandler(GetConversationByIdDifyAiQuery)
export class GetConversationByIdDifyAiQueryHandler
  implements
    IQueryHandler<
      GetConversationByIdDifyAiQuery,
      GetConversationByIdDifyAiResponseDto
    >
{
  constructor(private readonly httpService: HttpService) {}

  async execute(query: GetConversationByIdDifyAiQuery) {
    try {
      const dto = new GetConversationByIdDifyAiDto(query.input.params);
      const response = await fetchDto<GetConversationByIdDifyAiResponseDto>({
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
        'Error fetching conversation by ID from Dify AI'
      );
    }
  }
}
