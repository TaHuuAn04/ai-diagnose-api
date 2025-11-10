import { Exclude, Expose } from 'class-transformer';

import { OauthProviderEnum } from '../enums';

import { BaseEntity } from './base';

export interface OauthProfileMetadata {
  name: string;
  email: string;
  avatar: string;
}

@Exclude()
export class OauthProfileEntity extends BaseEntity {
  @Expose()
  userId: string;

  @Expose()
  oauthId: string;

  @Expose()
  provider: OauthProviderEnum;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  @Expose()
  metadata: OauthProfileMetadata;

  @Expose()
  isActive: boolean;
}
