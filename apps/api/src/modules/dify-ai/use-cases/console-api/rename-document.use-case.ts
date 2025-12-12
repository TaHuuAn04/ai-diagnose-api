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
  DocumentDifyAiDto,
  RenameDocumentDifyAiDto,
  RenameDocumentDifyAiInputDto,
} from '../../dtos/console-api';

export class RenameDocumentDifyAiCommand implements ICommand {
  constructor(
    public readonly user: UserEntity,
    public readonly input: RenameDocumentDifyAiInputDto,
  ) {}
}

@CommandHandler(RenameDocumentDifyAiCommand)
export class RenameDocumentDifyAiCommandHandler
  implements ICommandHandler<RenameDocumentDifyAiCommand, DocumentDifyAiDto>
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(command: RenameDocumentDifyAiCommand) {
    try {
      const { body, params } = command.input;
      const token = await this.difyService.getToken(command.user);
      const dto = new RenameDocumentDifyAiDto(params, body);
      const response = await fetchDto<RenameDocumentDifyAiDto>({
        httpService: this.httpService,
        dto,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return plainToInstance(DocumentDifyAiDto, response.data);
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error renaming document in Dify AI'
      );
    }
  }
}
