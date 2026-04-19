import { Expose, Type } from 'class-transformer';

import { UserGender } from '@app/core/domain/enums';

class UserInStaffResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  gender: UserGender;

  @Expose()
  phoneNumber: string;

  @Expose()
  avatarUrl: string;
}

export class GetStaffResponseDto {
  @Expose()
  userId: string;

  @Expose()
  staffCode: string;

  @Expose()
  department: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => UserInStaffResponseDto)
  user: UserInStaffResponseDto;
}
