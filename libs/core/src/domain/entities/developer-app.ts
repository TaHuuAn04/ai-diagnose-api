import { Expose } from 'class-transformer';

import { DeveloperAppStatus } from '../enums';

import { AiEntity } from './ai';
import { AppCredentialEntity } from './app-credential';
import { BaseEntity } from './base';
import { BotEntity } from './bot';
import { PlatformEntity } from './platform';
import { UserEntity } from './user';

@Expose()
export class DeveloperAppEntity extends BaseEntity {
  userId: string;

  platformId: string;

  name: string;

  description: string;

  status: DeveloperAppStatus;

  bots?: BotEntity[];

  user?: UserEntity;

  platform?: PlatformEntity;

  credentials?: AppCredentialEntity[];

  aiId: string;

  ai?: AiEntity;
}
