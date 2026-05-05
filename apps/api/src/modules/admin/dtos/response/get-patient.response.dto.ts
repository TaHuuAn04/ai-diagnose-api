import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { UserGender } from '@app/core/domain/enums';

class UserInPatientResponseDto {
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

  @Expose()
  dateOfBirth!: string;

  @Expose()
  isOnBoardingCompleted!: boolean;

  @Expose()
  createdAt!: Date;
}

export class GetPatientResponseDto {
  @Expose()
  userId: string;

  @Expose()
  citizenCode: string;

  @Expose()
  address: string;

  @Expose()
  medicalInsurance: string;

  @Expose()
  folk: string;

  @Expose()
  @Type(() => UserInPatientResponseDto)
  user: UserInPatientResponseDto;
}
