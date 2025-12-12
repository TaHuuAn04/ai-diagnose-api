/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export class DraftWorkflowDifyAiParamsDto {
  appId: string;
}

export class DraftWorkflowDifyAiBodyDto {
  graph: {
    nodes: any[];
    edges: any[];
    viewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };
  features: {
    opening_statement: string;
    suggested_questions: any[];
  };
  environment_variables: any[];
  conversation_variables: any[];
  hash: string;
}

export class DraftWorkflowDifyAiInputDto {
  params: DraftWorkflowDifyAiParamsDto;
  body: DraftWorkflowDifyAiBodyDto;
  token: string;
}

export class DraftWorkflowDifyAiResponseDto {
  result: string;
  hash: string;
  updated_at: number;
}

export class PostDraftWorkflowDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/apps/:appId/workflows/draft';
  public method = HttpMethod.POST;
  public url = PostDraftWorkflowDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: DraftWorkflowDifyAiResponseDto;

  constructor(
    public bodyDto: DraftWorkflowDifyAiBodyDto,
    public paramsDto: DraftWorkflowDifyAiParamsDto,
  ) {
    super();
  }
}
