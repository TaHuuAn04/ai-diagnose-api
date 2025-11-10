import { Expose } from 'class-transformer';

import { BotStatus } from '../enums';

import { AiEntity } from './ai';
import { BaseEntity } from './base';
import { DeveloperAppEntity } from './developer-app';

@Expose()
export class BotEntity extends BaseEntity {
  platformBotId: string;

  identifier: string;

  token: string;

  name: string;

  description: string;

  status: BotStatus;

  lastActiveAt: Date | null;

  aiId?: string;

  ai?: AiEntity;

  developerAppId?: string;

  developerApp?: DeveloperAppEntity;
}
