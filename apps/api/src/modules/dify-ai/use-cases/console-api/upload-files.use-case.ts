import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { User } from 'apps/api/src/infrastructure/database/typeorm-nest/entities';
import { AxiosHeaders } from 'axios';
import { plainToInstance } from 'class-transformer';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import { DifyAiService } from '../../dify-ai.service';
import {
  FileKnowledgeDifyAiResponseDto,
  UploadFileKnowledgeDifyAiDto,
  UploadFileKnowledgeDifyAiInputDto,
} from '../../dtos/console-api';

export class UploadFileKnowledgeDifyAiCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly input: UploadFileKnowledgeDifyAiInputDto,
  ) {}
}

@CommandHandler(UploadFileKnowledgeDifyAiCommand)
export class UploadFileKnowledgeDifyAiCommandHandler
  implements
    ICommandHandler<
      UploadFileKnowledgeDifyAiCommand,
      FileKnowledgeDifyAiResponseDto
    >
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: UploadFileKnowledgeDifyAiCommand,
  ): Promise<FileKnowledgeDifyAiResponseDto> {
    try {
      const { query, body } = command.input;

      const token = await this.difyService.getToken(command.user);
      const dto = new UploadFileKnowledgeDifyAiDto(query, body);
      const response = await fetchDto<FileKnowledgeDifyAiResponseDto>({
        httpService: this.httpService,
        dto,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return plainToInstance(FileKnowledgeDifyAiResponseDto, response.data);
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error uploading files to Dify AI'
      );
    }
  }
}
