import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { InternalApiDifyAiHeaderDto } from '..';

export class CreateTenantDifyAiInternalBodyDto {
  name: string;
  owner_email: string;
}

export class CreateTenantDifyAiInternalInputDto {
  body: CreateTenantDifyAiInternalBodyDto;
  headers: InternalApiDifyAiHeaderDto;
}

export class CreateTenantDifyAiInternalResponseDto {
  message: string;
  tenant_id: string;
}

export class PostCreateTenantDifyAiInternalDto extends HttpFetchDto {
  public static url = 'v1/tenants';
  public method = HttpMethod.POST;
  public url = PostCreateTenantDifyAiInternalDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: CreateTenantDifyAiInternalResponseDto;
  public headers: InternalApiDifyAiHeaderDto;

  constructor(public bodyDto: CreateTenantDifyAiInternalBodyDto) {
    super();
  }
}
