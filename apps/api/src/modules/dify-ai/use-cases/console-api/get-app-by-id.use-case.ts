import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  GetAppByIdDifyAiDto,
  GetAppByIdDifyAiInputDto,
  GetAppByIdDifyAiResponseDto,
} from '../../dtos';

export class GetAppByIdDifyAiCommand implements ICommand {
  constructor(public readonly input: GetAppByIdDifyAiInputDto) {}
}

@CommandHandler(GetAppByIdDifyAiCommand)
export class GetAppByIdDifyAiCommandHandler
  implements
    ICommandHandler<GetAppByIdDifyAiCommand, GetAppByIdDifyAiResponseDto>
{
  constructor(private readonly httpService: HttpService) {}

  async execute(command: GetAppByIdDifyAiCommand) {
    try {
      const dto = new GetAppByIdDifyAiDto(command.input.params);
      const response = await fetchDto<GetAppByIdDifyAiResponseDto>({
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${command.input.token}`,
        }),
        dto,
      });

      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return response.data;
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error fetching app by ID from Dify AI'
      );
    }
  }
}
