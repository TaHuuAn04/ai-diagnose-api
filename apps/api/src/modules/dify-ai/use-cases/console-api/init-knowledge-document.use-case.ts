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
  CreateKnowledgeDocumentDifyAiDto,
  InitKnowledgeDifyAiResponseDto,
  InitKnowledgeDocumentDifyAiDto,
} from '../../dtos/console-api';

export class InitKnowledgeDocumentDifyAiCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly input: CreateKnowledgeDocumentDifyAiDto,
  ) {}
}

@CommandHandler(InitKnowledgeDocumentDifyAiCommand)
export class InitKnowledgeDocumentDifyAiCommandHandler
  implements
    ICommandHandler<
      InitKnowledgeDocumentDifyAiCommand,
      InitKnowledgeDifyAiResponseDto
    >
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: InitKnowledgeDocumentDifyAiCommand,
  ): Promise<InitKnowledgeDifyAiResponseDto> {
    try {
      const token = await this.difyService.getToken(command.user);
      const dto = new InitKnowledgeDocumentDifyAiDto(command.input);
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
        'Error initializing knowledge document in Dify AI'
      );
    }
  }
}
