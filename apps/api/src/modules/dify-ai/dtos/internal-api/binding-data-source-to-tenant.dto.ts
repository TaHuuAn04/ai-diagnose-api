import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

import { InternalApiDifyAiHeaderDto } from '../base/internal-api-base.dto';

export const DEFAULT_BINDING_DATA_SOURCE_TO_TENANT_BODY = {
  category: 'website',
  provider: 'firecrawl',
  credentials: {
    auth_type: 'bearer',
    config: {
      api_key: '',
      base_url: '',
    },
  },
};

export class BindingDataSourceToTenantDifyAiParamsDto {
  tenantId: string;
}

export class BindingDataSourceToTenantDifyAiBodyDto {
  category: string;
  provider: string;
  credentials: {
    auth_type: string;
    config: {
      api_key: string;
      base_url: string;
    };
  };
}

export class BindingDataSourceToTenantDifyAiInputDto {
  body: BindingDataSourceToTenantDifyAiBodyDto;
  params: BindingDataSourceToTenantDifyAiParamsDto;
  headers: InternalApiDifyAiHeaderDto;
}

export class BindingDataSourceToTenantDifyAiResponseDto {
  result: string;
}

export class PostBindingDataSourceToTenantDifyAiDto extends HttpFetchDto {
  public static url = 'v1/tenants/:tenantId/data-sources';
  public method = HttpMethod.POST;
  public url = PostBindingDataSourceToTenantDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: BindingDataSourceToTenantDifyAiResponseDto;
  public headers: InternalApiDifyAiHeaderDto;

  constructor(
    public paramsDto: BindingDataSourceToTenantDifyAiParamsDto,
    public bodyDto: BindingDataSourceToTenantDifyAiBodyDto,
  ) {
    super();
  }
}
