import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  PostPublishWorkflowDifyAiDto,
  PublishWorkflowDifyAiInputDto,
  PublishWorkflowDifyAiResponseDto,
} from '../../../dtos';

export class PublishWorkflowDifyAiCommand implements ICommand {
  constructor(public readonly input: PublishWorkflowDifyAiInputDto) {}
}

@CommandHandler(PublishWorkflowDifyAiCommand)
export class PublishWorkflowDifyAiCommandHandler
  implements
    ICommandHandler<
      PublishWorkflowDifyAiCommand,
      PublishWorkflowDifyAiResponseDto
    >
{
  constructor(private readonly httpService: HttpService) {}

  async execute(
    command: PublishWorkflowDifyAiCommand,
  ): Promise<PublishWorkflowDifyAiResponseDto> {
    try {
      const { params, token } = command.input;
      const dto = new PostPublishWorkflowDifyAiDto(params);
      const response = await fetchDto<PublishWorkflowDifyAiResponseDto>({
        dto,
        httpService: this.httpService,
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
        'Error publishing workflow in Dify AI'
      );
    }
  }
}
