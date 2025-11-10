import { Expose } from 'class-transformer';

import { BaseEntity } from './base';

export class PlatformEntity extends BaseEntity {
  @Expose()
  name: string;

  @Expose()
  description?: string;
}
