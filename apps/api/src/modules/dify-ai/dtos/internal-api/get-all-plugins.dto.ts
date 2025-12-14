import { Exclude, Expose, Type } from 'class-transformer';

import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export class GetAllPluginsDifyAiBodyDto {
  page: number;
  page_size: number;
  query: string;
  sort_by: string;
  sort_order: string;
  category: string;
  exclude: string[];
  type: string;
}

export class GetAllPluginsDifyAiInputDto {
  body: GetAllPluginsDifyAiBodyDto;
}

@Exclude()
export class PluginDto {
  @Expose()
  name: string;
  @Expose()
  org: string;
  @Expose()
  latest_package_identifier: string;
  @Expose()
  plugin_id: string;
}

@Exclude()
export class PluginsDataDifyAiDto {
  @Expose()
  @Type(() => PluginDto)
  plugins: PluginDto[];

  @Expose()
  total: number;
}

@Exclude()
export class GetAllPluginsDifyAiResponseDto {
  @Expose()
  code: number;

  @Expose()
  @Type(() => PluginsDataDifyAiDto)
  data: PluginsDataDifyAiDto;

  @Expose()
  msg: string;
}

export class PostGetAllPluginsDifyAiDto extends HttpFetchDto {
  public method = HttpMethod.POST;
  public url = 'https://marketplace.dify.ai/api/v1/plugins/search/advanced';
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: GetAllPluginsDifyAiResponseDto;
  public headers: undefined;

  constructor(public bodyDto: GetAllPluginsDifyAiBodyDto) {
    super();
  }
}
