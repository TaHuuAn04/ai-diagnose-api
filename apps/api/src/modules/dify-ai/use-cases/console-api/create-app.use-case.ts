import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';
import { plainToInstance } from 'class-transformer';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  CreateAppDifyAiInputDto,
  CreateAppDifyAiResponseDto,
  PostCreateAppDifyAiDto,
} from '../../dtos';

export class CreateAppDifyAiCommand implements ICommand {
  constructor(public readonly input: CreateAppDifyAiInputDto) {}
}

@CommandHandler(CreateAppDifyAiCommand)
export class CreateAppDifyAiCommandHandler
  implements
    ICommandHandler<CreateAppDifyAiCommand, CreateAppDifyAiResponseDto>
{
  constructor(private readonly httpService: HttpService) {}

  async execute(
    command: CreateAppDifyAiCommand,
  ): Promise<CreateAppDifyAiResponseDto> {
    try {
      const { body, token } = command.input;
      const dto = new PostCreateAppDifyAiDto(body);
      const response = await fetchDto<CreateAppDifyAiResponseDto>({
        dto,
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return plainToInstance(CreateAppDifyAiResponseDto, response.data);
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error creating Dify AI app'
      );
    }
  }
}
