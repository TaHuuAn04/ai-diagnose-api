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
  CreateEmptyKnowledgeDifyAiBodyDto,
  CreateEmptyKnowledgeDifyAiResponseDto,
  PostCreateEmptyKnowledgeDifyAiDto,
} from '../../dtos/console-api/knowledge.dto';

export class CreateEmptyKnowledgeCommand implements ICommand {
  constructor(
    public readonly user: User,
    public readonly input: CreateEmptyKnowledgeDifyAiBodyDto,
  ) {}
}

@CommandHandler(CreateEmptyKnowledgeCommand)
export class CreateEmptyKnowledgeCommandHandler
  implements
    ICommandHandler<
      CreateEmptyKnowledgeCommand,
      CreateEmptyKnowledgeDifyAiResponseDto
    >
{
  constructor(
    private readonly difyService: DifyAiService,
    private readonly httpService: HttpService,
  ) {}

  async execute(
    command: CreateEmptyKnowledgeCommand,
  ): Promise<CreateEmptyKnowledgeDifyAiResponseDto> {
    try {
      const token = await this.difyService.getToken(command.user);
      const dto = new PostCreateEmptyKnowledgeDifyAiDto(command.input);
      const response = await fetchDto<CreateEmptyKnowledgeDifyAiResponseDto>({
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
        CreateEmptyKnowledgeDifyAiResponseDto,
        response.data,
      );
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error creating empty knowledge in Dify AI'
      );
    }
  }
}
