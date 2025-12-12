import { DIFY_AI_OPENAI_API_KEY, GEMINI_API_KEY } from '@app/core/environments';

export enum IndexingTechniqueDifyAi {
  HIGH_QUALITY = 'high_quality',
  ECONOMY = 'economy',
}

export enum EmbeddingModelDifyAi {
  TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large',
  TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small',
}

export enum ProviderDifyAi {
  GOOGLE = 'google',
  OPENAI = 'openai',
}

export enum ModelProviderDifyAi {
  OPENAI = 'langgenius/openai/openai',
  GOOGLE = 'langgenius/gemini/google',
}

// Enum for document form
export enum DocFormDifyAi {
  TEXT_MODEL = 'text_model',
}

// Enum for document language
export enum DocLanguageDifyAi {
  ENGLISH = 'English',
}

// Enum for search method
export enum SearchMethodDifyAi {
  FULL_TEXT_SEARCH = 'full_text_search',
  SEMANTIC_SEARCH = 'semantic_search',
}

export const configKeyProviderDifyAi: Record<
  ProviderDifyAi,
  { provider: string; credentials: Record<string, string> }
> = {
  [ProviderDifyAi.GOOGLE]: {
    provider: ModelProviderDifyAi.GOOGLE,
    credentials: {
      google_api_key: GEMINI_API_KEY,
    },
  },
  [ProviderDifyAi.OPENAI]: {
    provider: ModelProviderDifyAi.OPENAI,
    credentials: {
      openai_api_key: DIFY_AI_OPENAI_API_KEY,
    },
  },
};
