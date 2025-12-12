import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import { UserEntity } from '@app/core/domain/entities';
import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import { DifyAiService } from '../../dify-ai.service';
import {
  DisableKnowledgeDocumentDifyAiDto,
  EnableKnowledgeDocumentDifyAiDto,
  SetKnowledgeDocumentStatusDifyAiInputDto,
} from '../../dtos/console-api';

export class SetKnowledgeDocumentStatusDifyAiCommand implements ICommand {
  constructor(
    public readonly user: UserEntity,
    public readonly input: SetKnowledgeDocumentStatusDifyAiInputDto,
  ) {}
}

@CommandHandler(SetKnowledgeDocumentStatusDifyAiCommand)
export class SetKnowledgeDocumentStatusDifyAiCommandHandler
  implements ICommandHandler<SetKnowledgeDocumentStatusDifyAiCommand, unknown>
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(command: SetKnowledgeDocumentStatusDifyAiCommand) {
    try {
      const { params, isEnabled } = command.input;
      const token = await this.difyService.getToken(command.user);
      if (isEnabled) {
        const dto = new EnableKnowledgeDocumentDifyAiDto(params);
        const response = await fetchDto({
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
      }

      const dto = new DisableKnowledgeDocumentDifyAiDto(params);
      const response = await fetchDto<DisableKnowledgeDocumentDifyAiDto>({
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
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error setting knowledge document status in Dify AI'
      );
    }
  }
}
