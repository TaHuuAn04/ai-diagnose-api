import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

import { DifyAiAppModelConfigDto } from '../base/update-app-model-config-base.dto';

export class GetAppByIdDifyAiParamsDto {
  appId: string;
}

export class GetAppByIdDifyAiInputDto {
  params: GetAppByIdDifyAiParamsDto;
  token: string;
}

export class GetAppByIdDifyAiResponseDto {
  id: string;
  name: string;
  description: string;
  mode: string;
  icon_type: string;
  icon: string;
  icon_background: string;
  icon_url: string | null;
  enable_site: boolean;
  enable_api: boolean;
  model_config: DifyAiAppModelConfigDto;
  site: {
    access_token: string;
    code: string;
    title: string;
    icon_type: string;
    icon: string;
    icon_background: string;
    icon_url: string | null;
    description: string | null;
    default_language: string;
    chat_color_theme: string | null;
    chat_color_theme_inverted: boolean;
    customize_domain: string | null;
    copyright: string | null;
    privacy_policy: string | null;
    custom_disclaimer: string | null;
    customize_token_strategy: string;
    prompt_public: boolean;
    app_base_url: string;
    show_workflow_steps: boolean;
  };
  api_base_url: string;
  created_at: number;
  deleted_tools: unknown[];
}

export class GetAppByIdDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/apps/:appId';
  public method = HttpMethod.GET;
  public url = GetAppByIdDifyAiDto.url;
  public queryDto = undefined;
  public bodyDto = undefined;
  public responseDto: GetAppByIdDifyAiResponseDto;

  constructor(public paramsDto: GetAppByIdDifyAiParamsDto) {
    super();
  }
}
