import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

// DTOs for adding a provider
export class AddProviderDifyAiBodyDto {
  tenant_id: string;
  plugin_unique_identifiers: string[];
}

export class AddProviderDifyAiInputDto {
  body: AddProviderDifyAiBodyDto;
  token: string;
}

export class AddProviderDifyAiResponseDto {
  all_installed: boolean;
  task_id: string;
}

export class PostAddProviderDifyAiDto extends HttpFetchDto {
  public static url = 'v1/plugin/install/marketplace';
  public method = HttpMethod.POST;
  public url = PostAddProviderDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: AddProviderDifyAiResponseDto;
  public headers: undefined;

  constructor(public bodyDto: AddProviderDifyAiBodyDto) {
    super();
  }
}
