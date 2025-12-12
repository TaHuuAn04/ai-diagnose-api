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
  GetKnowledgeDifyAiDto,
  GetKnowledgeDifyAiParamsDto,
  KnowledgeDifyAiResponseDto,
} from '../../dtos/console-api';

export class GetKnowledgeDifyAiCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly input: GetKnowledgeDifyAiParamsDto,
  ) {}
}

@CommandHandler(GetKnowledgeDifyAiCommand)
export class GetKnowledgeDifyAiCommandHandler
  implements
    ICommandHandler<GetKnowledgeDifyAiCommand, KnowledgeDifyAiResponseDto>
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: GetKnowledgeDifyAiCommand,
  ): Promise<KnowledgeDifyAiResponseDto> {
    try {
      const token = await this.difyService.getToken(command.user);
      const dto = new GetKnowledgeDifyAiDto(command.input);
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

      return plainToInstance(KnowledgeDifyAiResponseDto, response.data);
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error fetching knowledge from Dify AI'
      );
    }
  }
}
