import { Expose } from 'class-transformer';

import { AiStatus, IndustryType } from '../enums';

import { AiTemplateEntity } from './ai-template';
import { BaseEntity } from './base';
import { DeveloperAppEntity } from './developer-app';
import { UserEntity } from './user';
export class AiEntity extends BaseEntity {
  @Expose()
  userId: string;

  @Expose()
  name: string;

  @Expose()
  model: string;

  @Expose()
  mode: string;

  @Expose()
  status: AiStatus;

  @Expose()
  instructions: string;

  @Expose()
  description: string;

  @Expose()
  user: UserEntity;

  @Expose()
  aiTemplateId: string;

  @Expose()
  aiTemplate: AiTemplateEntity;

  @Expose()
  tags: string;

  @Expose()
  developerApps: DeveloperAppEntity[];

  @Expose()
  industry: IndustryType;
}
