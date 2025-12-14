import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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

export class CreateEmptyKnowledgeDifyAiBodyDto {
  name: string;
  description: string;
  indexing_technique: string;
  permission: string;
}

export class PaginatioDifyAiDto<T> {
  data: T[];

  has_more: boolean;

  total: number;

  page: number;

  limit: number;
}

class RerankingModelDifyAiDto {
  reranking_provider_name?: string;
  reranking_model_name?: string;
}

class PartialMemberDifyAiDto {
  user_id: string;
  role: string;
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

// DTO for Knowledge
export class KnowledgeDifyAiResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string | null;

  @Expose()
  provider: string;

  @Expose()
  permission: string;

  @Expose()
  data_source_type: string | null;

  @Expose()
  indexing_technique: string;

  @Expose()
  app_count: number;

  @Expose()
  document_count: number;

  @Expose()
  word_count: number;

  @Expose()
  created_by: string;

  @Expose()
  created_at: number;

  @Expose()
  updated_by: string;

  @Expose()
  updated_at: number;

  @Expose()
  embedding_model: string | null;

  @Expose()
  embedding_model_provider: string | null;

  @Expose()
  embedding_available: boolean;

  @Expose()
  @Type(() => RetrievalModelDifyAiDto)
  retrieval_model_dict: RetrievalModelDifyAiDto;

  @Expose()
  @Type(() => RetrievalModelDifyAiDto)
  retrieval_model: RetrievalModelDifyAiDto;

  @Expose()
  tags: string[];

  @Expose()
  partial_member_list: string[];
}

export class CreateEmptyKnowledgeDifyAiResponseDto {
  @Expose()
  id: string;

  @Expose()
  created_at: number;

  @Expose()
  updated_at: number;

  @Expose()
  created_by: string;

  @Expose()
  updated_by: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  provider: string;

  @Expose()
  permission: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data_source_type: any;

  @Expose()
  indexing_technique: string;
}

export class GetKnowledgeDifyAiParamsDto {
  id: string;
}

export class UpdateKnowledgeDifyAiParamsDto {
  id: string;
}

export class DeleteKnowledgeDifyAiParamsDto {
  id: string;
}

export class UpdateKnowledgeDifyAiInputDto {
  params: UpdateKnowledgeDifyAiParamsDto;
  body: UpdateKnowledgeDifyAiBodyDto;
}

export class RequestParamsKnowledgeDifyAiDto {
  page?: number | null;
  limit?: number | null;
  provider?: string | null;
  keyword?: string | null;
  tag_ids?: string[] | null;
}

export class RequestQueryKnowledgeDocumentDifyAiDto {
  page?: number | null;
  limit?: number | null;
  keyword?: string | null;
}

export class GetKnowledgeDocumentDifyAiParamsDto {
  id: string;
}

export class DeleteKnowledgeDocumentDifyAiParamsDto {
  knowledge_id: string;
  document_id: string;
}

export class UploadFileKnowledgeDifyAiQueryParamsDto {
  source: string;
}

export class GetKnowledgeDocumentDifyAiInputDto {
  params: GetKnowledgeDocumentDifyAiParamsDto;
  query: RequestQueryKnowledgeDocumentDifyAiDto;
}

export class UploadFileKnowledgeDifyAiBodyDto {
  file: Express.Multer.File;
}

export class UploadFileKnowledgeDifyAiInputDto {
  query: UploadFileKnowledgeDifyAiQueryParamsDto;
  body: UploadFileKnowledgeDifyAiBodyDto;
}

export class FileKnowledgeDifyAiResponseDto {
  @Expose()
  @ApiProperty({ example: '76ab3fe2-c159-4461-a47f-33f5791d6fec' })
  id: string;

  @Expose()
  @ApiProperty({ example: '4b89bbc6-53f3-42e5-b6fd-c86bc41746b1' })
  created_by: string;

  @Expose()
  @ApiProperty({ example: 1726497734 })
  created_at: number;

  @Expose()
  @ApiProperty({ example: 'Email Data Client - 2024-T9.csv' })
  name: string;

  @Expose()
  @ApiProperty({ example: 2223 })
  size: number;

  @Expose()
  @ApiProperty({ example: 'csv' })
  extension: string;

  @Expose()
  @ApiProperty({ example: 'text/csv' })
  mime_type: string;
}

export class UpdateKnowledgeDifyAiBodyDto {
  @Expose()
  name?: string;

  @Expose()
  description?: string;

  @Expose()
  partial_member_list?: PartialMemberDifyAiDto[];

  @Expose()
  permission?: string;

  @Expose()
  indexing_technique?: string;

  @Expose()
  retrieval_model?: RetrievalModelDifyAiDto;

  @Expose()
  embedding_model?: string;

  @Expose()
  embedding_model_provider?: string;
}

@Exclude()
export class Pagination<T> {
  @Expose()
  data: T[];

  @Expose()
  has_more: boolean;

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  limit: number;
}

// DTO for pre-processing rules
class PreProcessingRulesDifyAiDto {
  id: string;

  enabled: boolean;
}

class FileInfoListDifyAiDto {
  file_ids: string[];
}

class InfoListDifyAiDto {
  data_source_type: string;

  @Type(() => FileInfoListDifyAiDto)
  file_info_list: FileInfoListDifyAiDto;
}

class DataSourceDifyAiDto {
  type: string;

  @Type(() => InfoListDifyAiDto)
  info_list: InfoListDifyAiDto;
}

// DTO for segmentation
class SegmentationDifyAiDto {
  separator: string;

  max_tokens: number;

  chunk_overlap: number;
}

// DTO for process rules
class ProcessRulesDifyAiDto {
  @Type(() => PreProcessingRulesDifyAiDto)
  pre_processing_rules?: PreProcessingRulesDifyAiDto[];

  @Type(() => SegmentationDifyAiDto)
  segmentation?: SegmentationDifyAiDto;
}

// DTO for process rule container
class ProcessRuleDifyAiDto {
  @Type(() => ProcessRulesDifyAiDto)
  rules: ProcessRulesDifyAiDto;

  mode: string;
}

export class CreateKnowledgeDocumentDifyAiDto {
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

export const DEFAULT_CREATE_KNOWLEDGE_DOCUMENT_DIFY_AI: CreateKnowledgeDocumentDifyAiDto =
  {
    data_source: {
      type: 'upload_file',
      info_list: {
        data_source_type: 'upload_file',
        file_info_list: {
          file_ids: [],
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

class DataSourceInfoDifyAiDto {
  @ApiProperty({
    description: 'ID of the uploaded file',
    example: 'dd3e7b27-d107-4283-a4b5-af4c970c2465',
  })
  @IsString()
  upload_file_id: string;

  @Expose()
  url: string;

  @Expose()
  provider: string;

  @Expose()
  job_id: string;

  @Expose()
  only_main_content: string;

  @Expose()
  mode: string;
}

export class DocumentDifyAiDto {
  @ApiProperty({
    description: 'Document unique ID',
    example: 'f61c0221-4606-4311-8453-2a24c8e0f463',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Position of the document in the dataset',
    example: 1,
  })
  @IsNumber()
  position: number;

  @ApiProperty({
    description: 'Type of data source',
    example: 'upload_file',
  })
  @IsString()
  data_source_type: string;

  @ApiProperty({
    description: 'Information about the data source',
    type: DataSourceInfoDifyAiDto,
  })
  @ValidateNested()
  @Type(() => DataSourceInfoDifyAiDto)
  data_source_info: DataSourceInfoDifyAiDto;

  @ApiProperty({
    description: 'Detailed information about the uploaded file',
    type: FileKnowledgeDifyAiResponseDto,
  })
  @ValidateNested()
  @Type(() => FileKnowledgeDifyAiResponseDto)
  data_source_detail_dict: {
    upload_file: FileKnowledgeDifyAiResponseDto;
  };

  @ApiProperty({
    description: 'Dataset process rule ID',
    example: 'cf01d97f-f9e2-41f4-a646-9f47114afcd1',
  })
  @IsString()
  dataset_process_rule_id: string;

  @ApiProperty({
    description: 'Name of the document',
    example: '19522434_Phạm Đắc Trung_MXH.docx',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Source from where the document was created',
    example: 'web',
  })
  @IsString()
  created_from: string;

  @ApiProperty({
    description: 'User who created the document',
    example: '4b89bbc6-53f3-42e5-b6fd-c86bc41746b1',
  })
  @IsString()
  created_by: string;

  @ApiProperty({
    description: 'Timestamp of when the document was created',
    example: 1726557639,
  })
  @IsNumber()
  created_at: number;

  @ApiProperty({
    description: 'Number of tokens in the document',
    example: 0,
  })
  @IsNumber()
  tokens: number;

  @ApiProperty({
    description: 'Indexing status of the document',
    example: 'parsing',
  })
  @IsString()
  indexing_status: string;

  @ApiProperty({
    description: 'Error information, if any',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsString()
  error?: string | null;

  @ApiProperty({
    description: 'Whether the document is enabled',
    example: true,
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    description: 'Timestamp when the document was disabled',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  disabled_at?: number | null;

  @ApiProperty({
    description: 'User who disabled the document',
    example: null,
    required: false,
  })
  @IsOptional()
  @IsString()
  disabled_by?: string | null;

  @ApiProperty({
    description: 'Whether the document is archived',
    example: false,
  })
  @IsBoolean()
  archived: boolean;

  @ApiProperty({
    description: 'Current display status of the document',
    example: 'indexing',
  })
  @IsString()
  display_status: string;

  @ApiProperty({
    description: 'Word count in the document',
    example: 0,
  })
  @IsNumber()
  word_count: number;

  @ApiProperty({
    description: 'Hit count for the document',
    example: 0,
  })
  @IsNumber()
  hit_count: number;

  @ApiProperty({
    description: 'Form of the document',
    example: 'text_model',
  })
  @IsString()
  doc_form: string;
}

class DatasetDifyAiDto {
  @ApiProperty({
    description: 'Unique ID of the dataset',
    example: '873e3ccb-06f0-40fc-8528-9a525fb33949',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Name of the dataset',
    example: '19522434_Phạm Đắc Trung_MXH.docx',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the dataset',
    example:
      'useful for when you want to answer queries about the 19522434_Phạm Đắc Trung_MXH.docx',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Permission level for the dataset',
    example: 'only_me',
  })
  @IsString()
  permission: string;

  @ApiProperty({
    description: 'Type of data source for the dataset',
    example: 'upload_file',
  })
  @IsString()
  data_source_type: string;

  @ApiProperty({
    description: 'Indexing technique used for the dataset',
    example: 'economy',
  })
  @IsString()
  indexing_technique: string;

  @ApiProperty({
    description: 'ID of the user who created the dataset',
    example: '4b89bbc6-53f3-42e5-b6fd-c86bc41746b1',
  })
  @IsString()
  created_by: string;

  @ApiProperty({
    description: 'Timestamp of when the dataset was created',
    example: 1726557639,
  })
  @IsNumber()
  created_at: number;
}

export class InitKnowledgeDifyAiResponseDto {
  @ApiProperty({
    description: 'Information about the dataset',
    type: DatasetDifyAiDto,
  })
  @ValidateNested()
  @Type(() => DatasetDifyAiDto)
  dataset: DatasetDifyAiDto;

  @ApiProperty({
    description: 'List of documents related to the dataset',
    type: [DocumentDifyAiDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentDifyAiDto)
  documents: DocumentDifyAiDto[];

  @ApiProperty({
    description: 'Batch information',
    example: '20240917072038133632',
  })
  @IsString()
  batch: string;
}

export class UpdateKnowledgeDocumentDifyAiParamsDto {
  id: string;
}

export class RenameDocumentDifyAiParamsDto {
  knowledge_id: string;
  document_id: string;
}

export class SetKnowledgeDocumentStatusDifyAiParamsDto {
  knowledge_id: string;
  document_id: string;
}

export class SetKnowledgeDocumentStatusDifyAiInputDto {
  params: SetKnowledgeDocumentStatusDifyAiParamsDto;
  isEnabled: boolean;
}

export class RenameDocumentDifyAiBodyDto {
  name: string;
}

export class RenameDocumentDifyAiInputDto {
  params: RenameDocumentDifyAiParamsDto;
  body: RenameDocumentDifyAiBodyDto;
}

export class PostCreateEmptyKnowledgeDifyAiDto extends HttpFetchDto {
  public static url = 'datasets';
  public method = HttpMethod.POST;
  public url = PostCreateEmptyKnowledgeDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: CreateEmptyKnowledgeDifyAiResponseDto;

  constructor(public bodyDto: CreateEmptyKnowledgeDifyAiBodyDto) {
    super();
  }
}

export class GetKnowledgesDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets';
  public method = HttpMethod.GET;
  public url = GetKnowledgesDifyAiDto.url;
  public paramsDto = null;
  // public queryDto = null;
  public bodyDto = null;
  public responseDto: PaginatioDifyAiDto<KnowledgeDifyAiResponseDto>;

  constructor(public queryDto: RequestParamsKnowledgeDifyAiDto) {
    super();

    // Handle missing or default values
    this.queryDto.page = this.queryDto.page ?? 1; // Default page to 1
    this.queryDto.limit = this.queryDto.limit ?? 20; // Default limit to 20
    this.queryDto.provider = this.queryDto.provider ?? 'vendor'; // Default provider
    // this.queryDto.keyword = this.queryDto.keyword ?? null; // Handle keyword nullability

    // this.queryDto.tag_ids = this.queryDto.tag_ids?.length
    //   ? this.queryDto.tag_ids
    //   : undefined;
  }
}

export class GetKnowledgeDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets/:id';
  public method = HttpMethod.GET;
  public url = GetKnowledgeDifyAiDto.url;
  // public paramsDto = undefined;
  public bodyDto = undefined;
  public queryDto = undefined;
  public responseDto: KnowledgeDifyAiResponseDto;

  constructor(public paramsDto: GetKnowledgeDifyAiParamsDto) {
    super();
  }
}

export class UpdateKnowledgeDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets/:id';
  public method = HttpMethod.PATCH;
  public url = UpdateKnowledgeDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: KnowledgeDifyAiResponseDto;

  constructor(
    public paramsDto: UpdateKnowledgeDifyAiParamsDto,
    public bodyDto: UpdateKnowledgeDifyAiBodyDto,
  ) {
    super();
  }
}

export class DeleteKnowledgeDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets/:id';
  public method = HttpMethod.DELETE;
  public url = DeleteKnowledgeDifyAiDto.url;
  public bodyDto = undefined;
  public queryDto = undefined;
  public responseDto: unknown;

  constructor(public paramsDto: UpdateKnowledgeDifyAiParamsDto) {
    super();
  }
}

export class UploadFileKnowledgeDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/files/upload';
  public method = HttpMethod.POST;
  public url = UploadFileKnowledgeDifyAiDto.url;
  public paramsDto = undefined;
  public responseDto: FileKnowledgeDifyAiResponseDto;

  constructor(
    public queryDto: UploadFileKnowledgeDifyAiQueryParamsDto,
    public bodyDto: UploadFileKnowledgeDifyAiBodyDto,
  ) {
    super();
  }

  public toFormData(): FormData {
    const formData = new FormData();

    // check if file is an array
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const file: Express.Multer.File = Array.isArray(this.bodyDto.file)
      ? this.bodyDto.file[0]
      : this.bodyDto.file;

    // Convert Buffer to Blob
    // Use Uint8Array to ensure compatibility with BlobPart type
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype,
    });

    // Append the file to the form data
    formData.append('file', blob, file.originalname);

    return formData;
  }
}

export class InitKnowledgeDocumentDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets/init';
  public method = HttpMethod.POST;
  public url = InitKnowledgeDocumentDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: InitKnowledgeDifyAiResponseDto;

  constructor(public bodyDto: CreateKnowledgeDocumentDifyAiDto) {
    super();
  }
}

export class UpdateKnowledgeDocumentDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets/:id/documents';
  public method = HttpMethod.POST;
  public url = UpdateKnowledgeDocumentDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: InitKnowledgeDifyAiResponseDto;

  constructor(
    public paramsDto: UpdateKnowledgeDocumentDifyAiParamsDto,
    public bodyDto: CreateKnowledgeDocumentDifyAiDto,
  ) {
    super();
  }
}

export class GetKnowledgeDocumentDifyAiDto extends HttpFetchDto {
  public static url = 'console/api/datasets/:id/documents';
  public method = HttpMethod.GET;
  public url = GetKnowledgeDocumentDifyAiDto.url;
  public bodyDto = undefined;
  public responseDto: PaginatioDifyAiDto<DocumentDifyAiDto>;

  constructor(
    public paramsDto: GetKnowledgeDocumentDifyAiParamsDto,
    public queryDto: RequestQueryKnowledgeDocumentDifyAiDto,
  ) {
    super();
  }
}

export class DeleteKnowledgeDocumentDifyAiDto extends HttpFetchDto {
  public static url =
    'console/api/datasets/:knowledge_id/documents/:document_id';
  public method = HttpMethod.DELETE;
  public url = DeleteKnowledgeDocumentDifyAiDto.url;
  public bodyDto = undefined;
  public queryDto = undefined;
  public responseDto: unknown;

  constructor(public paramsDto: DeleteKnowledgeDocumentDifyAiParamsDto) {
    super();
  }
}

export class RenameDocumentDifyAiDto extends HttpFetchDto {
  public static url =
    'console/api/datasets/:knowledge_id/documents/:document_id/rename';
  public method = HttpMethod.POST;
  public url = RenameDocumentDifyAiDto.url;
  public queryDto = undefined;
  public responseDto: unknown;

  constructor(
    public paramsDto: RenameDocumentDifyAiParamsDto,
    public bodyDto: RenameDocumentDifyAiBodyDto,
  ) {
    super();
  }
}

export class EnableKnowledgeDocumentDifyAiDto extends HttpFetchDto {
  public static url =
    'console/api/datasets/:knowledge_id/documents/:document_id/status/enable';
  public method = HttpMethod.PATCH;
  public url = EnableKnowledgeDocumentDifyAiDto.url;
  public queryDto = undefined;
  public bodyDto = undefined;
  public responseDto: unknown;

  constructor(public paramsDto: SetKnowledgeDocumentStatusDifyAiParamsDto) {
    super();
  }
}

export class DisableKnowledgeDocumentDifyAiDto extends HttpFetchDto {
  public static url =
    'console/api/datasets/:knowledge_id/documents/:document_id/status/disable';
  public method = HttpMethod.PATCH;
  public url = DisableKnowledgeDocumentDifyAiDto.url;
  public queryDto = undefined;
  public bodyDto = undefined;
  public responseDto: unknown;

  constructor(public paramsDto: SetKnowledgeDocumentStatusDifyAiParamsDto) {
    super();
  }
}
