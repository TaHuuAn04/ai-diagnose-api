import { UserRole } from '../enums';

import { BaseEntity } from './base';

export class UserEntity extends BaseEntity {
  firstName: string;

  lastName: string;

  email: string;

  role: UserRole;

  password: string;

  phoneCode: string;

  phoneNumber: string;

  isOnBoardingCompleted: boolean;

  isEmailVerified: boolean;
}
