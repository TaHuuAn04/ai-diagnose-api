import { Readable } from 'stream';

import { HttpService } from '@nestjs/axios';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AxiosHeaders } from 'axios';
import { plainToInstance } from 'class-transformer';

import {
  ExceptionHandler,
  ExternalServiceException,
} from '@app/core/exception';
import { fetchDto, fetchStreamDto } from '@app/core/http';

import {
  ChatMessageDifyAiInputDto,
  ChatMessageDifyAiResponseDto,
  PostChatMessageDifyAiDto,
} from '../../dtos';

export class ChatMessageBlockDifyAiCommand implements ICommand {
  constructor(public readonly input: ChatMessageDifyAiInputDto) {}
}

@CommandHandler(ChatMessageBlockDifyAiCommand)
export class ChatMessageBlockDifyAiCommandHandler
  implements
    ICommandHandler<ChatMessageBlockDifyAiCommand, ChatMessageDifyAiResponseDto>
{
  constructor(private readonly httpService: HttpService) {}

  async execute(
    command: ChatMessageBlockDifyAiCommand,
  ): Promise<ChatMessageDifyAiResponseDto> {
    try {
      const { body, token } = command.input;
      const dto = new PostChatMessageDifyAiDto(body);
      const response = await fetchDto<string>({
        dto,
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token}`,
        }),
      });
      if (!response.status) {
        throw new ExternalServiceException('Dify API error', response.message);
      }

      return plainToInstance(ChatMessageDifyAiResponseDto, response.data);
    } catch (error) {
      ExceptionHandler.handleErrorException(
        error,
        'Error sending chat message in Dify AI'
      )
    }
  }
}

// -------------------------------------------------------------------------------------------------

export class ChatMessageStreamDifyAiCommand implements ICommand {
  constructor(public readonly input: ChatMessageDifyAiInputDto) {}
}

@CommandHandler(ChatMessageStreamDifyAiCommand)
export class ChatMessageStreamDifyAiCommandHandler
  implements ICommandHandler<ChatMessageStreamDifyAiCommand, Readable>
{
  constructor(private readonly httpService: HttpService) {}

  async execute(command: ChatMessageStreamDifyAiCommand): Promise<Readable> {
    try {
      const { body, token } = command.input;
      const dto = new PostChatMessageDifyAiDto(body);
      const response = await fetchStreamDto({
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
        'Error streaming chat message in Dify AI'
      );
    }
  }
}
