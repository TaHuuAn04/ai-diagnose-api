import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { User } from 'apps/api/src/infrastructure/database/typeorm-nest/entities';
import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import { DifyAiService } from '../../dify-ai.service';
import {
  DeleteKnowledgeDocumentDifyAiDto,
  DeleteKnowledgeDocumentDifyAiParamsDto,
} from '../../dtos/console-api';

export class DeleteKnowledgeDocumentDifyAiCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly input: DeleteKnowledgeDocumentDifyAiParamsDto,
  ) {}
}

@CommandHandler(DeleteKnowledgeDocumentDifyAiCommand)
export class DeleteKnowledgeDocumentDifyAiCommandHandler
  implements ICommandHandler<DeleteKnowledgeDocumentDifyAiCommand>
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: DeleteKnowledgeDocumentDifyAiCommand,
  ): Promise<unknown> {
    try {
      const token = await this.difyService.getToken(command.user);
      const dto = new DeleteKnowledgeDocumentDifyAiDto(command.input);
      const response = await fetchDto<unknown>({
        httpService: this.httpService,
        dto,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return response.data;

      // return plainToInstance(KnowledgeDifyAiResponseDto, response.data);
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error deleting knowledge document in Dify AI'
      );
    }
  }
}
