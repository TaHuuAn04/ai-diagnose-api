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
  DeleteKnowledgeDifyAiDto,
  DeleteKnowledgeDifyAiParamsDto,
  KnowledgeDifyAiResponseDto,
} from '../../dtos/console-api';

export class DeleteKnowledgeDifyAiCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly input: DeleteKnowledgeDifyAiParamsDto,
  ) {}
}

@CommandHandler(DeleteKnowledgeDifyAiCommand)
export class DeleteKnowledgeDifyAiCommandHandler
  implements ICommandHandler<DeleteKnowledgeDifyAiCommand>
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: DeleteKnowledgeDifyAiCommand,
  ): Promise<KnowledgeDifyAiResponseDto> {
    try {
      const token = await this.difyService.getToken(command.user);
      const dto = new DeleteKnowledgeDifyAiDto(command.input);
      const response = await fetchDto<KnowledgeDifyAiResponseDto>({
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
        'Error deleting knowledge in Dify AI'
      );
    }
  }
}
