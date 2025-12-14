import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { InternalApiDifyAiHeaderDto } from '..';

export class LoginWithoutPasswordDifyAiBodyDto {
  email: string;
}

export class LoginWithoutPasswordDifyAiInputDto {
  body: LoginWithoutPasswordDifyAiBodyDto;
  headers: InternalApiDifyAiHeaderDto;
}

export class LoginWithoutPasswordDifyAiResponseDto {
  result: string;
  data: string; // token
}

export class PostLoginWithoutPasswordDifyAiDto extends HttpFetchDto {
  public static url = 'login-without-password';
  public method = HttpMethod.POST;
  public url = PostLoginWithoutPasswordDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: LoginWithoutPasswordDifyAiResponseDto;
  public headers: InternalApiDifyAiHeaderDto;

  constructor(public bodyDto: LoginWithoutPasswordDifyAiBodyDto) {
    super();
  }
}
