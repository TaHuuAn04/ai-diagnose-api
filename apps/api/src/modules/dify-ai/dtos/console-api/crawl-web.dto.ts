import { Type } from 'class-transformer';

import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

import {
  DocFormDifyAi,
  DocLanguageDifyAi,
  EmbeddingModelDifyAi,
  IndexingTechniqueDifyAi,
  ModelProviderDifyAi,
  SearchMethodDifyAi,
} from '../base/enum';

export class CrawlOptionsDifyAiDto {
  crawl_sub_pages: boolean;
  only_main_content: boolean;
  includes: string;
  excludes: string;
  limit: number;
  max_depth: number;
}

export class CrawlRequestDifyAiDto {
  url: string;
  options: CrawlOptionsDifyAiDto;
  provider: string;
}

export class CrawlRequestDifyAiInputDto {
  body: CrawlRequestDifyAiDto;
}
export class CrawlRequestDifyAiResponseDto {
  status: string;
  job_id: string;
}

export class JobCrawlWebDifyAiInputDto {
  params: JobCrawlWebDifyAiParamsDto;
}

class SimpleWebsiteDifyAiResponseDto {
  title: string;
  description: string;
  source_url: string;
  markdown: string;
}

export class JobCrawlWebDifyAiResponseDto {
  status: string;
  job_id: string;
  total: number;
  current: number;
  data: SimpleWebsiteDifyAiResponseDto[];
  time_consuming: string;
}

export class JobCrawlWebDifyAiParamsDto {
  job_id: string;
}

class WebInfoListDifyAiDto {
  provider: string;
  job_id: string;
  urls: string[];
  only_main_content: boolean;
}

class InfoListDifyAiDto {
  data_source_type: string;

  @Type(() => WebInfoListDifyAiDto)
  website_info_list: WebInfoListDifyAiDto;
}

class DataSourceDifyAiDto {
  type: string;

  @Type(() => InfoListDifyAiDto)
  info_list: InfoListDifyAiDto;
}

class PreProcessingRulesDifyAiDto {
  id: string;

  enabled: boolean;
}

class SegmentationDifyAiDto {
  separator: string;

  max_tokens: number;

  chunk_overlap: number;
}

class ProcessRulesDifyAiDto {
  @Type(() => PreProcessingRulesDifyAiDto)
  pre_processing_rules?: PreProcessingRulesDifyAiDto[];

  @Type(() => SegmentationDifyAiDto)
  segmentation?: SegmentationDifyAiDto;
}

class ProcessRuleDifyAiDto {
  @Type(() => ProcessRulesDifyAiDto)
  rules: ProcessRulesDifyAiDto;

  mode: string;
}

class RerankingModelDifyAiDto {
  reranking_provider_name?: string;
  reranking_model_name?: string;
}

class RetrievalModelDifyAiDto {
  search_method?: string;
  reranking_enable?: boolean;
  reranking_mode?: string | null;
  reranking_model?: RerankingModelDifyAiDto;
  weights?: object | null;
  top_k?: number;
  score_threshold_enabled?: boolean;
  score_threshold?: number;
}

export class CreateKnowledgeWebDifyAiDto {
  @Type(() => DataSourceDifyAiDto)
  data_source: DataSourceDifyAiDto;

  indexing_technique: IndexingTechniqueDifyAi;

  embedding_model: EmbeddingModelDifyAi;

  embedding_model_provider: ModelProviderDifyAi;

  @Type(() => ProcessRuleDifyAiDto)
  process_rule: ProcessRuleDifyAiDto;

  doc_form: DocFormDifyAi;

  doc_language: DocLanguageDifyAi;

  @Type(() => RetrievalModelDifyAiDto)
  retrieval_model: RetrievalModelDifyAiDto;
}

export const DEFAULT_CREATE_KNOWLEDGE_WEB_DIFY_AI: CreateKnowledgeWebDifyAiDto =
  {
    data_source: {
      type: 'website_crawl',
      info_list: {
        data_source_type: 'website_crawl',
        website_info_list: {
          provider: 'firecrawl',
          job_id: '',
          urls: [''],
          only_main_content: true,
        },
      },
    },
    doc_form: DocFormDifyAi.TEXT_MODEL,
    doc_language: DocLanguageDifyAi.ENGLISH,
    indexing_technique: IndexingTechniqueDifyAi.HIGH_QUALITY,
    embedding_model: EmbeddingModelDifyAi.TEXT_EMBEDDING_3_LARGE,
    embedding_model_provider: ModelProviderDifyAi.OPENAI,
    process_rule: {
      mode: 'automatic',
      rules: {},
    },
    retrieval_model: {
      reranking_enable: false,
      reranking_model: {},
      score_threshold: 0.5,
      score_threshold_enabled: false,
      search_method: SearchMethodDifyAi.SEMANTIC_SEARCH,
      top_k: 3,
    },
  };

export class UpdateWebKnowledgeDifyAiInputDto {
  params: UpdateKnowledgeWebDifyAiParamsDto;
  body: CreateKnowledgeWebDifyAiDto;
}

export class CrawlWebDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/website/crawl';
  public method = HttpMethod.POST;
  public url = CrawlWebDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: unknown;

  constructor(public bodyDto: CrawlRequestDifyAiDto) {
    super();
  }
}

export class UpdateKnowledgeWebDifyAiParamsDto {
  id: string;
}

export class JobCrawlWebDifyAiDto extends HttpFetchDto {
  public static url =
    'console/api/website/crawl/status/:job_id?provider=firecrawl';
  public method = HttpMethod.GET;
  public url = JobCrawlWebDifyAiDto.url;
  public bodyDto = undefined;
  public queryDto = undefined;
  public responseDto: JobCrawlWebDifyAiResponseDto;

  constructor(public paramsDto: JobCrawlWebDifyAiParamsDto) {
    super();
  }
}

export class InitKnowledgeWebDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets/init';
  public method = HttpMethod.POST;
  public url = InitKnowledgeWebDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: unknown;

  constructor(public bodyDto: CreateKnowledgeWebDifyAiDto) {
    super();
  }
}

export class UpdateKnowledgeWebDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets/:id/documents';
  public method = HttpMethod.POST;
  public url = UpdateKnowledgeWebDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: unknown;

  constructor(
    public paramsDto: UpdateKnowledgeWebDifyAiParamsDto,
    public bodyDto: CreateKnowledgeWebDifyAiDto,
  ) {
    super();
  }
}
