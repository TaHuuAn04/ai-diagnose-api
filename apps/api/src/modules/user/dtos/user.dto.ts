import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from '@app/core/domain/enums';

export class UserInfoDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  role: UserRole;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phoneCode: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  isOnBoardingCompleted: boolean;
}

export class UpdateUserDto {
  // @IsOptional()
  // @IsEmail()
  // @ApiProperty({ example: 'newemail@example.com' })
  // email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'John' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'Doe' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  @ApiProperty({ example: '+84' })
  phoneCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(9)
  @ApiProperty({ example: '123456789' })
  phoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  isOnBoardingCompleted?: boolean;
}
