import { Expose, Type } from 'class-transformer';

import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

import { ConversationDto } from '../../base/get-conversation-base.dto';

export class GetConversationDifyQueryDto {
  page?: number;
  limit?: number;
  start?: string;
  end?: string;
  sort_by?: string;
  keyword?: string;
}

export class GetConversationDifyParamsDto {
  app_id: string;
}

export class GetConversationDifyInputDto {
  query: GetConversationDifyQueryDto;
  params: GetConversationDifyParamsDto;
  token: string;
}

export class GetConversationDifyResponseDto {
  @Expose()
  page: number;
  @Expose()
  limit: number;
  @Expose()
  has_more: boolean;
  @Expose()
  total: number;
  @Expose()
  @Type(() => ConversationDto)
  data: ConversationDto[];
}

export class GetConversationDifyDto extends HttpFetchDto {
  public static url = 'apps/:app_id/chat-conversations';
  public method = HttpMethod.GET;
  public url = GetConversationDifyDto.url;
  public bodyDto = undefined;
  public responseDto: GetConversationDifyResponseDto;

  constructor(
    public queryDto: GetConversationDifyQueryDto,
    public paramsDto: GetConversationDifyParamsDto,
  ) {
    super();
  }
}
