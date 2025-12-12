import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

export class LoginDifyAiBodyDto {
  email: string;
  password: string;
}

export class LoginDifyAiInputDto extends LoginDifyAiBodyDto {}

export class LoginDifyAiResponseDto {
  result: string;
  data: string; // token
}

export class DifyAiTokenPayloadDto {
  user_id: string;
  exp: number;
  iss: string;
  sub: string;
}

export class PostLoginDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/login';
  public method = HttpMethod.POST;
  public url = PostLoginDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: LoginDifyAiResponseDto;

  constructor(public bodyDto: LoginDifyAiBodyDto) {
    super();
  }
}
