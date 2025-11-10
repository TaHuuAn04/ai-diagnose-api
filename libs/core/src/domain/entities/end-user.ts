import { Expose } from 'class-transformer';

import { BaseEntity } from './base';

@Expose()
export class EndUserEntity extends BaseEntity {
  userEmail: string;

  userName: string;
}
