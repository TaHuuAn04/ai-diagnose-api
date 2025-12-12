import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export class PublishWorkflowDifyAiParamsDto {
  appId: string;
}

export class PublishWorkflowDifyAiInputDto {
  params: PublishWorkflowDifyAiParamsDto;
  token: string;
}

export class PublishWorkflowDifyAiResponseDto {
  result: string;
  created_at: number;
}

export class PostPublishWorkflowDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/apps/:appId/workflows/publish';
  public method = HttpMethod.POST;
  public url = PostPublishWorkflowDifyAiDto.url;
  public bodyDto = {};
  public queryDto = undefined;
  public responseDto: PublishWorkflowDifyAiResponseDto;

  constructor(public paramsDto: PublishWorkflowDifyAiParamsDto) {
    super();
  }
}
