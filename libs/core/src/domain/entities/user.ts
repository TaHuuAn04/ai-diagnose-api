import { UserGender, UserRole } from '../enums';

import { BaseEntity } from './base';

export class UserEntity extends BaseEntity {
  firstName?: string | null;

  lastName?: string | null;

  email: string;

  gender: UserGender;

  dateOfBirth?: string | null;

  role: UserRole;

  password: string;

  phoneCode?: string | null;

  phoneNumber?: string | null;

  avatarUrl?: string | null;

  isOnBoardingCompleted: boolean;

  isEmailVerified: boolean;
}
