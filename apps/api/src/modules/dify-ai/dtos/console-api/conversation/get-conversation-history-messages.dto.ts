import { Expose, Type } from 'class-transformer';

import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { MessageDto } from '../../base/get-message-base.dto';

export class GetConversationHistoryMessagesDifyQueryDto {
  conversation_id: string;
  limit: number;
  page: number;
}

export class GetConversationHistoryMessagesDifyParamsDto {
  app_id: string;
}

export class GetConversationHistoryMessagesDifyInputDto {
  query: GetConversationHistoryMessagesDifyQueryDto;
  params: GetConversationHistoryMessagesDifyParamsDto;
  token: string;
}

export class GetConversationHistoryMessagesDifyResponseDto {
  @Expose()
  page: number;
  @Expose()
  limit: number;
  @Expose()
  has_more: boolean;
  @Expose()
  total: number;
  @Expose()
  @Type(() => MessageDto)
  data: MessageDto[];
}

export class GetConversationHistoryMessagesDifyDto extends HttpFetchDto {
  public static url = 'v1/apps/:app_id/chat-messages';
  public method = HttpMethod.GET;
  public url = GetConversationHistoryMessagesDifyDto.url;
  public bodyDto = undefined;
  public responseDto: GetConversationHistoryMessagesDifyResponseDto;

  constructor(
    public queryDto: GetConversationHistoryMessagesDifyQueryDto,
    public paramsDto: GetConversationHistoryMessagesDifyParamsDto,
  ) {
    super();
  }
}
