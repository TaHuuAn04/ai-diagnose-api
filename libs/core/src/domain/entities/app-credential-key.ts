import { BaseEntity } from './base';

export class AppCredentialKeyEntity extends BaseEntity {
  id: string;

  platformId: string;

  name: string;

  required: boolean;

  description: string;
}
