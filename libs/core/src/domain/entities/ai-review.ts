import { Expose } from 'class-transformer';

import { BaseEntity } from './base';

import { AiEntity, EndUserEntity } from '.';

export class AiReviewEntity extends BaseEntity {
  @Expose()
  aiId: string;

  @Expose()
  ai?: AiEntity;

  @Expose()
  externalConversationId: string;

  @Expose()
  endUserId: string;

  @Expose()
  endUser: EndUserEntity;

  @Expose()
  rating: number;

  @Expose()
  comment: string;
}
