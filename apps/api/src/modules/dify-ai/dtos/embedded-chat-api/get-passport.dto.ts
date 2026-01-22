import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export class GetPassportDifyAiQueryDto {
  user_id: string;
}

export class GetPassportDifyAiHeadersDto {
  'x-app-code': string;
}

export class GetPassportDifyAiInputDto {
  headers: GetPassportDifyAiHeadersDto;
  query: GetPassportDifyAiQueryDto;
}

export class GetPassportDifyAiResponseDto {
  access_token: string;
}

export class GetPassportDifyAiDto extends HttpFetchDto {
  public static url = 'api/passport';
  public method = HttpMethod.GET;
  public url = GetPassportDifyAiDto.url;
  public paramsDto = undefined;
  public bodyDto = undefined;
  public responseDto: GetPassportDifyAiResponseDto;

  constructor(
    public queryDto: GetPassportDifyAiQueryDto,
    public headers: GetPassportDifyAiHeadersDto,
  ) {
    super();
  }
}
