import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  DraftWorkflowDifyAiInputDto,
  DraftWorkflowDifyAiResponseDto,
  PostDraftWorkflowDifyAiDto,
} from '../../../dtos';

export class DraftWorkflowDifyAiCommand implements ICommand {
  constructor(public readonly input: DraftWorkflowDifyAiInputDto) {}
}

@CommandHandler(DraftWorkflowDifyAiCommand)
export class DraftWorkflowDifyAiCommandHandler
  implements
    ICommandHandler<DraftWorkflowDifyAiCommand, DraftWorkflowDifyAiResponseDto>
{
  constructor(private readonly httpService: HttpService) {}

  async execute(
    command: DraftWorkflowDifyAiCommand,
  ): Promise<DraftWorkflowDifyAiResponseDto> {
    try {
      const { body, params, token } = command.input;
      const dto = new PostDraftWorkflowDifyAiDto(body, params);
      const response = await fetchDto<DraftWorkflowDifyAiResponseDto>({
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
        'Error drafting workflow in Dify AI'
      );
    }
  }
}
