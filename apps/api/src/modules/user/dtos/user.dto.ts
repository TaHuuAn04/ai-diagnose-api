import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserGender, UserRole } from '@app/core/domain/enums';

export class UserInfoDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  role: UserRole;

  @Expose()
  firstName?: string | null;

  @Expose()
  lastName?: string | null;

  @Expose()
  gender: UserGender;

  @Expose()
  dateOfBirth?: string | null;

  @Expose()
  phoneCode?: string | null;

  @Expose()
  phoneNumber?: string | null;

  @Expose()
  avatarUrl?: string | null;

  @Expose()
  isOnBoardingCompleted: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'John', required: false })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'Doe', required: false })
  lastName?: string;

  @IsOptional()
  @IsEnum(UserGender)
  @ApiProperty({ enum: UserGender, example: UserGender.MALE, required: false })
  gender?: UserGender;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '1990-01-01', required: false })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  @ApiProperty({ example: '+84', required: false })
  phoneCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(9)
  @ApiProperty({ example: '123456789', required: false })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  isOnBoardingCompleted?: boolean;
}
