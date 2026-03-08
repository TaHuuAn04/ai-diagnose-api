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
  UploadFileChatDifyAiBodyDto,
  UploadFileChatDifyAiHttpDto,
  UploadFileChatDifyAiInputDto,
  UploadFileChatDifyAiResponseDto,
} from '../../dtos';

export class UploadFileChatDifyAiCommand implements ICommand {
  constructor(public readonly input: UploadFileChatDifyAiInputDto) {}
}

@CommandHandler(UploadFileChatDifyAiCommand)
export class UploadFileChatDifyAiCommandHandler
  implements
    ICommandHandler<
      UploadFileChatDifyAiCommand,
      UploadFileChatDifyAiResponseDto
    >
{
  constructor(private readonly httpService: HttpService) {}

  async execute(
    command: UploadFileChatDifyAiCommand,
  ): Promise<UploadFileChatDifyAiResponseDto> {
    try {
      const { file, token } = command.input;
      const bodyDto = new UploadFileChatDifyAiBodyDto();
      bodyDto.file = file;
      const dto = new UploadFileChatDifyAiHttpDto(bodyDto);
      const response = await fetchDto<UploadFileChatDifyAiResponseDto>({
        dto,
        httpService: this.httpService,
        headers: new AxiosHeaders({
          'x-app-code': process.env.DIFY_AI_APP_ID ?? '',
          'x-app-passport': token,
        }),
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return plainToInstance(UploadFileChatDifyAiResponseDto, response.data);
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error uploading file to Dify AI',
      );
    }
  }
}
