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
  PostUpdateAppModelConfigDifyAiDto,
  UpdateAppModelConfigDifyAiInputDto,
  UpdateAppModelConfigDifyAiResponseDto,
} from '../../dtos/console-api/update-app-model-config.dto';

export class UpdateAppModelConfigDifyAiCommand implements ICommand {
  constructor(public readonly input: UpdateAppModelConfigDifyAiInputDto) {}
}

@CommandHandler(UpdateAppModelConfigDifyAiCommand)
export class UpdateAppModelConfigDifyAiCommandHandler
  implements
    ICommandHandler<
      UpdateAppModelConfigDifyAiCommand,
      UpdateAppModelConfigDifyAiResponseDto
    >
{
  constructor(private readonly httpService: HttpService) {}

  async execute(command: UpdateAppModelConfigDifyAiCommand) {
    try {
      const { body, params, token } = command.input;
      const dto = new PostUpdateAppModelConfigDifyAiDto(body, params);
      const response = await fetchDto<UpdateAppModelConfigDifyAiResponseDto>({
        httpService: this.httpService,
        dto,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return plainToInstance(
        UpdateAppModelConfigDifyAiResponseDto,
        response.data,
      );
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error updating AI model config in Dify AI'
      );
    }
  }
}
