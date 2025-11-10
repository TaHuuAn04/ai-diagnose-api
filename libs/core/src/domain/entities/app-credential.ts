import { AppCredentialKeyEntity } from './app-credential-key';
import { BaseEntity } from './base';

export class AppCredentialEntity extends BaseEntity {
  id: string;

  value: string;

  appCredentialKeyId: string;

  developerAppId: string;

  appCredentialKey?: AppCredentialKeyEntity;
}
