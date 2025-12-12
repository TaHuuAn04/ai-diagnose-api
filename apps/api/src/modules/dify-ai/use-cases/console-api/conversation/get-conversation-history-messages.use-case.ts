import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  GetConversationHistoryMessagesDifyDto,
  GetConversationHistoryMessagesDifyInputDto,
  GetConversationHistoryMessagesDifyResponseDto,
} from '../../../dtos';

export class GetConversationHistoryMessagesDifyCommand implements ICommand {
  constructor(
    public readonly input: GetConversationHistoryMessagesDifyInputDto,
  ) {}
}

@CommandHandler(GetConversationHistoryMessagesDifyCommand)
export class GetConversationHistoryMessagesDifyCommandHandler
  implements
    ICommandHandler<
      GetConversationHistoryMessagesDifyCommand,
      GetConversationHistoryMessagesDifyResponseDto
    >
{
  // TODO: Inject the DifyAiService here to get the token (avoid passing the token through the dto)
  constructor(private readonly httpService: HttpService) {}

  async execute(
    command: GetConversationHistoryMessagesDifyCommand,
  ): Promise<GetConversationHistoryMessagesDifyResponseDto> {
    try {
      const dto = new GetConversationHistoryMessagesDifyDto(
        command.input.query,
        command.input.params,
      );
      const response =
        await fetchDto<GetConversationHistoryMessagesDifyResponseDto>({
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
        'Error getting conversation history messages from Dify'
      );
    }
  }
}
