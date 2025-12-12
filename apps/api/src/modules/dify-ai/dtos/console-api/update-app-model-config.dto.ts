import { HttpMethod } from '@app/core/domain/enums';
import { AI_EMBEDDING_MODEL_NAME, AI_EMBEDDING_MODEL_PROVIDER, AI_MODEL_MODE, AI_MODEL_NAME, AI_MODEL_PROVIDER } from '@app/core/environments';
import { HttpFetchDto } from '@app/core/http/http-fetch.dto';

import { DifyAiAppModelConfigDto } from '../base/update-app-model-config-base.dto';

export const DEFAULT_AI_MODEL_CONFIG = {
  model: {
    provider: AI_MODEL_PROVIDER,
    name: AI_MODEL_NAME,
    mode: AI_MODEL_MODE,
    completion_params: {
      stop: [],
    },
  },
  pre_prompt: 'simple',

  prompt_type: 'simple',
  chat_prompt_config: {},
  completion_prompt_config: {},
  user_input_form: [],
  dataset_query_variable: '',
  opening_statement: '',
  suggested_questions: [],
  more_like_this: {
    enabled: false,
  },
  suggested_questions_after_answer: {
    enabled: false,
  },
  speech_to_text: {
    enabled: false,
  },
  text_to_speech: {
    enabled: false,
  },
  retriever_resource: {
    enabled: true,
  },
  sensitive_word_avoidance: {
    enabled: false,
    type: '',
    configs: [],
  },
  agent_mode: {
    max_iteration: 5,
    enabled: true,
    strategy: 'function_call',
    tools: [],
    prompt: null,
  },
  dataset_configs: {
    retrieval_model: 'multiple',
    top_k: 4,
    reranking_mode: 'weighted_score',
    weights: {
      vector_setting: {
        vector_weight: 1,
        embedding_provider_name: AI_EMBEDDING_MODEL_PROVIDER,
        embedding_model_name: AI_EMBEDDING_MODEL_NAME,
      },
      keyword_setting: {
        keyword_weight: 0,
      },
    },
    reranking_enable: true,
    datasets: {
      datasets: [],
    },
  },
  file_upload: {
    image: {
      enabled: true,
      number_limits: 3,
      detail: 'high',
      transfer_methods: ['remote_url', 'local_file'],
    },
  },
};

export class UpdateAppModelConfigDifyAiParamsDto {
  appId: string;
}

export class UpdateAppModelConfigDifyAiBodyDto extends DifyAiAppModelConfigDto {}

export class UpdateAppModelConfigDifyAiInputDto {
  params: UpdateAppModelConfigDifyAiParamsDto;
  body: UpdateAppModelConfigDifyAiBodyDto;
  token: string;
}

export class UpdateAppModelConfigDifyAiResponseDto {
  result: string;
}

export class PostUpdateAppModelConfigDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/apps/:appId/model-config';
  public method = HttpMethod.POST;
  public url = PostUpdateAppModelConfigDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: UpdateAppModelConfigDifyAiResponseDto;

  constructor(
    public bodyDto: UpdateAppModelConfigDifyAiBodyDto,
    public paramsDto: UpdateAppModelConfigDifyAiParamsDto,
  ) {
    super();
  }
}
