import { AiEntity } from './ai';
import { BaseEntity } from './base';

export class AiSettingKeyValues {
  name: string;

  value: string;
}

export class AiSettingEntity extends BaseEntity {
  aiId: string;

  ai: AiEntity;

  name: string;

  value: string;
}
