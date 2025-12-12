import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';
import { plainToInstance } from 'class-transformer';

import { UserEntity } from '@app/core/domain/entities';
import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import { DifyAiService } from '../../dify-ai.service';
import {
  CreateKnowledgeDocumentDifyAiDto,
  InitKnowledgeDifyAiResponseDto,
  UpdateKnowledgeDocumentDifyAiDto,
  UpdateKnowledgeDocumentDifyAiParamsDto,
} from '../../dtos/console-api';

export class UpdateKnowledgeDocumentDifyAiCommand implements ICommand {
  constructor(
    public readonly user: UserEntity,
    public readonly params: UpdateKnowledgeDocumentDifyAiParamsDto,
    public readonly input: CreateKnowledgeDocumentDifyAiDto,
  ) {}
}

@CommandHandler(UpdateKnowledgeDocumentDifyAiCommand)
export class UpdateKnowledgeDocumentDifyAiCommandHandler
  implements
    ICommandHandler<
      UpdateKnowledgeDocumentDifyAiCommand,
      InitKnowledgeDifyAiResponseDto
    >
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: UpdateKnowledgeDocumentDifyAiCommand,
  ): Promise<InitKnowledgeDifyAiResponseDto> {
    try {
      const token = await this.difyService.getToken(command.user);
      const dto = new UpdateKnowledgeDocumentDifyAiDto(
        command.params,
        command.input,
      );
      const response = await fetchDto<InitKnowledgeDifyAiResponseDto>({
        httpService: this.httpService,
        dto,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return plainToInstance(InitKnowledgeDifyAiResponseDto, response.data);
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error updating AI model config in Dify AI'
      );

    }
  }
}
