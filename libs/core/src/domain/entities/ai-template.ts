import { BaseEntity } from './base';

export class AiTemplateEntity extends BaseEntity {
  name: string;

  mode: string;

  version: string;

  data: string;

  defaultInput: string;

  isCurrent: boolean;
}
