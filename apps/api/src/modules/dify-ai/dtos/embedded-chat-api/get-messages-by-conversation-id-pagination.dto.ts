import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export class GetMessagesByConversationIdPaginationDifyAiQueryDto {
  conversation_id: string;
  limit: number;
  page: number;
}

export class GetMessagesByConversationIdPaginationDifyAiInputDto {
  query: GetMessagesByConversationIdPaginationDifyAiQueryDto;
  token: string;
}

export class MessageItemPaginationDifyAiDto {
  id: string;
  conversation_id: string;
  inputs: Record<string, unknown>;
  query: string;
  answer: string;
  created_at: number;
}

export class GetMessagesByConversationIdPaginationDifyAiResponseDto {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
  data: MessageItemPaginationDifyAiDto[];
}

export class GetMessagesByConversationIdPaginationDifyAiDto extends HttpFetchDto {
  public static url = 'api/messages/pagination';
  public method = HttpMethod.GET;
  public url = GetMessagesByConversationIdPaginationDifyAiDto.url;
  public bodyDto = undefined;
  public paramsDto = undefined;
  public responseDto: GetMessagesByConversationIdPaginationDifyAiResponseDto;

  constructor(
    public queryDto: GetMessagesByConversationIdPaginationDifyAiQueryDto,
  ) {
    super();
  }
}
