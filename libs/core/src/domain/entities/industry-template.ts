import { IndustryType } from '../enums';

import { BaseEntity } from './base';

export class IndustryTemplateEntity extends BaseEntity {
  industryType: IndustryType;

  template: string;
}
