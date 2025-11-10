import { BaseEntity } from "./base";
import { DeveloperAppEntity } from "./developer-app";

export class LoginPlatformTokenEntity extends BaseEntity {
  developerAppId: string;

  accessToken: string;

  refreshToken: string;

  developerApp?: DeveloperAppEntity;
}
