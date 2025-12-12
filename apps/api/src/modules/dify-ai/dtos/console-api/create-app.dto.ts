import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export const DEFAULT_CREATE_APP_BODY = {
  name: 'My App',
  icon_type: 'emoji',
  icon: '🤖',
  icon_background: '#FFEAD5',
  description: 'My App Advanced Chat',
};

export class CreateAppDifyAiBodyDto {
  name: string;
  icon_background: string;
  icon_type: string;
  icon: string;
  mode: string;
  description: string;
}

export class CreateAppDifyAiInputDto {
  body: CreateAppDifyAiBodyDto;
  token: string;
}

export class CreateAppDifyAiResponseDto {
  id: string;
  name: string;
  description: string;
  mode: string;
  icon: string;
  icon_background: string;
  enable_site: boolean;
  enable_api: boolean;
  created_at: number;
}

export class PostCreateAppDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/apps';
  public method = HttpMethod.POST;
  public url = PostCreateAppDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: CreateAppDifyAiResponseDto;

  constructor(public bodyDto: CreateAppDifyAiBodyDto) {
    super();
  }
}
