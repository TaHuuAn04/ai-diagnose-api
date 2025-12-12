import { Expose, Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { MessageDto } from '..';

export class GetMessagesByConversationIdDifyAiQueryDto {
  @IsUUID()
  @IsNotEmpty()
  conversation_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(100)
  @Min(10)
  @Transform(({ value }) => Number(value))
  limit = 10;

  @IsUUID()
  @IsOptional()
  @Transform(({ value }) => (String(value) === '' ? '' : String(value)))
  @ValidateIf((object, value) => value !== '')
  first_id = '';
}

export class GetMessagesByConversationIdDifyAiInputDto {
  query: GetMessagesByConversationIdDifyAiQueryDto;
  token: string;
}

export class GetMessagesByConversationIdDifyAiResponseDto {
  @Expose()
  limit: number;

  @Expose()
  has_more: boolean;

  @Expose()
  @Type(() => MessageDto)
  data: MessageDto[];
}

export class MessageItemDto {
  @Expose()
  id: string;

  @Expose()
  message: string;

  @Expose()
  type: 'received' | 'sent';
}

export class GetMessagesByConversationIdCodelightResponseDto {
  @Expose()
  limit: number;

  @Expose()
  has_more: boolean;

  @Expose()
  @Type(() => MessageItemDto)
  data: MessageItemDto[];
}

export class GetMessagesByConversationIdDifyAiDto extends HttpFetchDto {
  public static url = 'api/messages';
  public method = HttpMethod.GET;
  public url = GetMessagesByConversationIdDifyAiDto.url;
  public bodyDto = undefined;
  public paramsDto = undefined;
  public responseDto: GetMessagesByConversationIdDifyAiResponseDto;

  constructor(public queryDto: GetMessagesByConversationIdDifyAiQueryDto) {
    super();
  }
}
