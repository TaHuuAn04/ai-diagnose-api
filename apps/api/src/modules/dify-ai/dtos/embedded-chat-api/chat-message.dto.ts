import { Expose } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { BlockingModeResponseDto } from '..';
import { ChatFileDto } from '../../../embedded-chat/dtos';

export const DEFAULT_SEND_CHAT_MESSAGE = {
  inputs: {},
  query: '',
  response_mode: 'streaming',
  conversation_id: '',
  // user: 'abc-123',
  files: [],
};

export class ChatMessageDifyAiBodyDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsOptional()
  response_mode: string;

  @IsString()
  @IsOptional()
  conversation_id?: string;

  @IsString()
  @IsOptional()
  parent_message_id?: string;

  @IsObject()
  @IsOptional()
  inputs?: Record<string, unknown> = {};

  @IsArray()
  @IsOptional()
  files?: ChatFileDto[] = [];

  // @IsString()
  // @IsNotEmpty()
  // user: string;
}

export class ChatMessageDifyAiResponseDto extends BlockingModeResponseDto {
  @Expose()
  query: string;
}

export class ChatMessageDifyAiInputDto {
  body: ChatMessageDifyAiBodyDto;
  token: string;
}

export class PostChatMessageDifyAiDto extends HttpFetchDto {
  public static url = 'api/chat-messages';
  public method = HttpMethod.POST;
  public url = PostChatMessageDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto = undefined;

  constructor(public bodyDto: ChatMessageDifyAiBodyDto) {
    super();
  }
}
