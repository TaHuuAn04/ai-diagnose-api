import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { InternalApiDifyAiHeaderDto } from '..';

export class CreateAccountDifyAiInternalBodyDto {
  email: string;
  name: string;
  password: string;
  interface_language: string;
}

export class CreateAccountDifyAiInternalInputDto {
  body: CreateAccountDifyAiInternalBodyDto;
  headers: InternalApiDifyAiHeaderDto;
}

export class CreateAccountDifyAiInternalResponseDto {
  message: string;
  account_id: string;

  // Additional fields
  tenant_id: string;
}

export class PostCreateAccountDifyAiInternalDto extends HttpFetchDto {
  public static url = 'v1/accounts';
  public method = HttpMethod.POST;
  public url = PostCreateAccountDifyAiInternalDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: CreateAccountDifyAiInternalResponseDto;
  public headers: InternalApiDifyAiHeaderDto;

  constructor(public bodyDto: CreateAccountDifyAiInternalBodyDto) {
    super();
  }
}
