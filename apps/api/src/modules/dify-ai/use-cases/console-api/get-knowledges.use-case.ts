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
  GetKnowledgesDifyAiDto,
  KnowledgeDifyAiResponseDto,
  PaginatioDifyAiDto,
  RequestParamsKnowledgeDifyAiDto,
} from '../../dtos/console-api';

export class GetKnowledgesDifyAiCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly input: RequestParamsKnowledgeDifyAiDto,
  ) {}
}

@CommandHandler(GetKnowledgesDifyAiCommand)
export class GetKnowledgesDifyAiCommandHandler
  implements
    ICommandHandler<
      GetKnowledgesDifyAiCommand,
      PaginatioDifyAiDto<KnowledgeDifyAiResponseDto>
    >
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: GetKnowledgesDifyAiCommand,
  ): Promise<PaginatioDifyAiDto<KnowledgeDifyAiResponseDto>> {
    try {
      const token = await this.difyService.getToken(command.user);
      const dto = new GetKnowledgesDifyAiDto(command.input);
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

      return plainToInstance(
        PaginatioDifyAiDto<KnowledgeDifyAiResponseDto>,
        response.data,
      );
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error fetching knowledges from Dify AI'
      );
    }
  }
}
