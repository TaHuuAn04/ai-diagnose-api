export enum DifyAiUserInputFormItemType {
  TEXT_INPUT = 'text-input',
  PARAGRAPH = 'paragraph',
  NUMBER = 'number',
  SELECT = 'select',
}

export class BaseDifyAiUserInputFormItem {
  label: string;
  variable: string;
  required: boolean;
  default: string;
}

export type DifyAiUserInputFormItem =
  | { [DifyAiUserInputFormItemType.TEXT_INPUT]: BaseDifyAiUserInputFormItem }
  | { [DifyAiUserInputFormItemType.PARAGRAPH]: BaseDifyAiUserInputFormItem }
  | { [DifyAiUserInputFormItemType.NUMBER]: BaseDifyAiUserInputFormItem }
  | {
      [DifyAiUserInputFormItemType.SELECT]: BaseDifyAiUserInputFormItem & {
        options: string[];
      };
    };

export class DifyAiAgentToolDto {
  provider_id: string;
  provider_type: string;
  provider_name: string;
  tool_name: string;
  tool_label: string;
  tool_parameters: Record<string, string>; // TODO: Define the type for tool_parameters
  enabled: boolean;
  isDeleted: boolean;
  notAuthor: boolean;
}

export class DifyAiDatasetConfigDto {
  top_k: number;
  reranking_mode: string;
  weights: {
    vector_setting: {
      vector_weight: number;
      embedding_provider_name: string;
      embedding_model_name: string;
    };
    keyword_setting: {
      keyword_weight: number;
    };
  };
  reranking_enable: boolean;
  retrieval_model: string;
  datasets: {
    datasets: {
      dataset: {
        enabled: boolean;
        id: string;
      };
    }[];
  };
}

export class DifyAiAppModelConfigDto {
  pre_prompt: string;
  prompt_type: string;
  chat_prompt_config: Record<string, unknown>; // Consider using a more specific type
  completion_prompt_config: Record<string, unknown>; // Consider using a more specific type
  user_input_form: DifyAiUserInputFormItem[];
  dataset_query_variable: string;
  opening_statement: string;
  suggested_questions: string[];
  more_like_this: { enabled: boolean };
  suggested_questions_after_answer: { enabled: boolean };
  speech_to_text: { enabled: boolean };
  text_to_speech: Partial<{
    enabled: boolean;
    voice: string;
    language: string;
  }>;
  retriever_resource: { enabled: boolean };
  sensitive_word_avoidance: Partial<{
    enabled: boolean;
    type: string;
    configs: unknown[];
  }>;
  agent_mode: Partial<{
    max_iteration: number;
    enabled: boolean;
    strategy: string;
    tools: DifyAiAgentToolDto[];
    prompt: string | null;
  }>;
  model: {
    provider: string;
    name: string;
    mode: string;
    completion_params: {
      stop: string[];
    };
  };
  dataset_configs: DifyAiDatasetConfigDto;
  file_upload: {
    image: Partial<{
      enabled: boolean;
      number_limits: number;
      detail: string;
      transfer_methods: string[];
    }>;
  };
}
