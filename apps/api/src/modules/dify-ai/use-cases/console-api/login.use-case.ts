import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  LoginDifyAiInputDto,
  LoginDifyAiResponseDto,
  PostLoginDifyAiDto,
} from '../../dtos';

export class LoginDifyAiCommand implements ICommand {
  constructor(public readonly input: LoginDifyAiInputDto) {}
}

@CommandHandler(LoginDifyAiCommand)
export class LoginDifyAiCommandHandler
  implements ICommandHandler<LoginDifyAiCommand, LoginDifyAiResponseDto>
{
  constructor(private readonly httpService: HttpService) {}

  async execute(command: LoginDifyAiCommand) {
    try {
      const dto = new PostLoginDifyAiDto(command.input);
      const response = await fetchDto<LoginDifyAiResponseDto>({
        httpService: this.httpService,
        dto,
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return response.data;
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error logging in to Dify AI'
      );
    }
  }
}
