import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

export class GetConversationByIdDifyAiParamsDto {
  conversationId: string;
}

export class GetConversationByIdDifyAiInputDto {
  params: GetConversationByIdDifyAiParamsDto;
  token: string;
}

export class GetConversationByIdDifyAiResponseDto {
  id: string;

  status: string;

  name: string;

  created_at: number;
}

export class GetConversationByIdDifyAiDto extends HttpFetchDto {
  public static url = 'web/conversations/:conversationId';
  public method = HttpMethod.GET;
  public url = GetConversationByIdDifyAiDto.url;
  public bodyDto = undefined;
  public queryDto = undefined;
  public responseDto: GetConversationByIdDifyAiResponseDto;

  constructor(public paramsDto: GetConversationByIdDifyAiParamsDto) {
    super();
  }
}
