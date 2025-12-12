import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  GetConversationDifyDto,
  GetConversationDifyInputDto,
  GetConversationDifyResponseDto,
} from '../../../dtos/console-api/conversation';

export class GetConversationsDifyCommand implements ICommand {
  constructor(public input: GetConversationDifyInputDto) {}
}

@CommandHandler(GetConversationsDifyCommand)
export class GetConversationsDifyCommandHandler
  implements
    ICommandHandler<
      GetConversationsDifyCommand,
      GetConversationDifyResponseDto
    >
{
  constructor(private readonly httpService: HttpService) {}

  async execute(
    command: GetConversationsDifyCommand,
  ): Promise<GetConversationDifyResponseDto> {
    try {
      const dto = new GetConversationDifyDto(
        command.input.query,
        command.input.params,
      );
      const response = await fetchDto<GetConversationDifyResponseDto>({
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${command.input.token}`,
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
        'Error getting conversations from Dify AI'
      );
    }
  }
}
