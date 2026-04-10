import { Expose } from 'class-transformer';

export class ChatbotModelResponseDto {
  @Expose()
  id: string;

  @Expose()
  version: string;

  @Expose()
  name: string;

  @Expose()
  isPublic: boolean;

  @Expose()
  accessToken: string;

  @Expose()
  knowledgeName: string;

  @Expose()
  knowledgeUrl: string;

  @Expose()
  modelConfig: any;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
