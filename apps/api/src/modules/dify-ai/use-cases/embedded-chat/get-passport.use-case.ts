import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto } from '@app/core/http';

import {
  GetPassportDifyAiDto,
  GetPassportDifyAiInputDto,
  GetPassportDifyAiResponseDto,
} from '../../dtos';

export class GetPassportDifyAiCommand implements ICommand {
  constructor(public readonly input: GetPassportDifyAiInputDto) {}
}

@CommandHandler(GetPassportDifyAiCommand)
export class GetPassportDifyAiCommandHandler
  implements
    ICommandHandler<GetPassportDifyAiCommand, GetPassportDifyAiResponseDto>
{
  constructor(private readonly httpService: HttpService) {}

  async execute(command: GetPassportDifyAiCommand) {
    try {
      const dto = new GetPassportDifyAiDto(
        command.input.body,
        command.input.headers,
      );

      const response = await fetchDto<GetPassportDifyAiResponseDto>({
        httpService: this.httpService,
        headers: new AxiosHeaders({
          ...command.input.headers,
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
        'Error fetching passport from Dify AI'
      );
    }
  }
}
