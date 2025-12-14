import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { InternalApiDifyAiHeaderDto } from '..';

export class AddAccountToTenantDifyAiBodyDto {
  account_id: string;
  role: string;
}

export class AddAccountToTenantDifyAiParamsDto {
  tenantId: string;
}

export class AddAccountToTenantDifyAiInputDto {
  params: AddAccountToTenantDifyAiParamsDto;
  body: AddAccountToTenantDifyAiBodyDto;
  headers: InternalApiDifyAiHeaderDto;
}

export class AddAccountToTenantDifyAiResponseDto {
  message: string;
}

export class PostAddAccountToTenantDifyAiDto extends HttpFetchDto {
  public static url = 'v1/tenants/:tenantId/members';
  public method = HttpMethod.POST;
  public url = PostAddAccountToTenantDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: AddAccountToTenantDifyAiResponseDto;
  public headers: InternalApiDifyAiHeaderDto;

  constructor(
    public paramsDto: AddAccountToTenantDifyAiParamsDto,
    public bodyDto: AddAccountToTenantDifyAiBodyDto,
  ) {
    super();
  }
}
