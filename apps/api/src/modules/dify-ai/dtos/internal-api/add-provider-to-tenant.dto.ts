import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { InternalApiDifyAiHeaderDto } from '..';

export class AddProviderToTenantDifyAiBodyDto {
  provider: string;
  credentials: Record<string, string>;
}

export class AddProviderToTenantDifyAiParamsDto {
  tenantId: string;
}

export class AddProviderToTenantDifyAiInputDto {
  params: AddProviderToTenantDifyAiParamsDto;
  body: AddProviderToTenantDifyAiBodyDto;
  headers: InternalApiDifyAiHeaderDto;
}

export class AddProviderToTenantDifyAiResponseDto {
  result: string;
}

export class PostAddProviderToTenantDifyAiDto extends HttpFetchDto {
  public static url = 'v1/tenants/:tenantId/model-providers';
  public method = HttpMethod.POST;
  public url = PostAddProviderToTenantDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: AddProviderToTenantDifyAiResponseDto;
  public headers: InternalApiDifyAiHeaderDto;

  constructor(
    public paramsDto: AddProviderToTenantDifyAiParamsDto,
    public bodyDto: AddProviderToTenantDifyAiBodyDto,
  ) {
    super();
  }
}
