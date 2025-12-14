import { HttpService } from '@nestjs/axios';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  GetConversationDifyAiDto,
  GetConversationDifyAiInputDto,
  GetConversationDifyAiResponseDto,
} from '../../dtos';

export class GetConversationDifyAiQuery implements IQuery {
  constructor(public readonly input: GetConversationDifyAiInputDto) {}
}

@QueryHandler(GetConversationDifyAiQuery)
export class GetConversationDifyAiQueryHandler
  implements
    IQueryHandler<GetConversationDifyAiQuery, GetConversationDifyAiResponseDto>
{
  constructor(private readonly httpService: HttpService) {}

  async execute(query: GetConversationDifyAiQuery) {
    try {
      const dto = new GetConversationDifyAiDto(query.input.query);
      const response = await fetchDto<GetConversationDifyAiResponseDto>({
        httpService: this.httpService,
        headers: new AxiosHeaders({
          'x-app-code': process.env.DIFY_AI_APP_ID ?? '',
          'x-app-passport': query.input.token,
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
        'Error fetching conversation from Dify AI'
      );
    }
  }
}
