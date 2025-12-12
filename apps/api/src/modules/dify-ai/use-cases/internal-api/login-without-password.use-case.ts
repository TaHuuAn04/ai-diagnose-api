import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  LoginWithoutPasswordDifyAiInputDto,
  LoginWithoutPasswordDifyAiResponseDto,
  PostLoginWithoutPasswordDifyAiDto,
} from '../../dtos';

export class LoginWithoutPasswordDifyAiCommand implements ICommand {
  constructor(public readonly input: LoginWithoutPasswordDifyAiInputDto) {}
}

@CommandHandler(LoginWithoutPasswordDifyAiCommand)
export class LoginWithoutPasswordDifyAiCommandHandler
  implements
    ICommandHandler<
      LoginWithoutPasswordDifyAiCommand,
      LoginWithoutPasswordDifyAiResponseDto
    >
{
  constructor(private readonly httpService: HttpService) {}

  async execute(command: LoginWithoutPasswordDifyAiCommand) {
    try {
      const dto = new PostLoginWithoutPasswordDifyAiDto(command.input.body);
      const response = await fetchDto<LoginWithoutPasswordDifyAiResponseDto>({
        httpService: this.httpService,
        headers: new AxiosHeaders({
          ...command.input.headers,
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
        'Error logging in without password to Dify AI'
      );
    }
  }
}
