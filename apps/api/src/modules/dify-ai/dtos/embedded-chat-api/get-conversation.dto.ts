import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

export class GetConversationDifyAiQueryDto {
  take: number;
  page: number;
}

export class GetConversationDifyAiInputDto {
  query: GetConversationDifyAiQueryDto;
  token: string;
}

export class GetConversationDifyAiResponseDto {
  limit: number;

  has_more: boolean;

  data: ConversationDataItem[];
}

export class ConversationDataItem {
  id: string;

  name: string;

  status: string;

  introduction: string;

  created_at: number;

  updated_at: number;
}

export class GetConversationDifyAiDto extends HttpFetchDto {
  public static url = 'api/conversations';
  public method = HttpMethod.GET;
  public url = GetConversationDifyAiDto.url;
  public bodyDto = undefined;
  public paramsDto = undefined;
  public responseDto: GetConversationDifyAiResponseDto;

  constructor(public queryDto: GetConversationDifyAiQueryDto) {
    super();
  }
}
