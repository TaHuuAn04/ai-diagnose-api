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
  DocumentDifyAiDto,
  GetKnowledgeDocumentDifyAiDto,
  GetKnowledgeDocumentDifyAiInputDto,
  PaginatioDifyAiDto,
} from '../../dtos/console-api';

export class GetKnowledgeDocumentDifyAiCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly input: GetKnowledgeDocumentDifyAiInputDto,
  ) {}
}

@CommandHandler(GetKnowledgeDocumentDifyAiCommand)
export class GetKnowledgesDocumentDifyAiCommandHandler
  implements
    ICommandHandler<
      GetKnowledgeDocumentDifyAiCommand,
      PaginatioDifyAiDto<DocumentDifyAiDto>
    >
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: GetKnowledgeDocumentDifyAiCommand,
  ): Promise<PaginatioDifyAiDto<DocumentDifyAiDto>> {
    try {
      const { params, query } = command.input;
      const token = await this.difyService.getToken(command.user);
      const dto = new GetKnowledgeDocumentDifyAiDto(params, query);
      const response = await fetchDto<DocumentDifyAiDto>({
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
        PaginatioDifyAiDto<DocumentDifyAiDto>,
        response.data,
      );
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error fetching knowledge document from Dify AI'
      );
    }
  }
}
