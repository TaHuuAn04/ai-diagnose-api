import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export class GetPassportDifyAiBodyDto {
  name: string;
  email: string;
  nimspace_ai_id: string;
}

export class GetPassportDifyAiHeadersDto {
  'x-app-code': string;
}

export class GetPassportDifyAiInputDto {
  headers: GetPassportDifyAiHeadersDto;
  body: GetPassportDifyAiBodyDto;
}

export class GetPassportDifyAiResponseDto {
  access_token: string;
}

export class GetPassportDifyAiDto extends HttpFetchDto {
  public static url = 'v1/web/passport';
  public method = HttpMethod.POST;
  public url = GetPassportDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: GetPassportDifyAiResponseDto;

  constructor(
    public bodyDto: GetPassportDifyAiBodyDto,
    public headers: GetPassportDifyAiHeadersDto,
  ) {
    super();
  }
}
