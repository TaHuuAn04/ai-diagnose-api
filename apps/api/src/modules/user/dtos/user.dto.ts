import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from '@app/core/domain/enums';

export class UserInfoDto {
  @Expose()
  @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333'})
  id: string;

  @Expose()
  @ApiProperty({ example: 'newemail@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'PATIENT'})
  role: UserRole;

  @Expose()
  @ApiProperty({ example: 'Nguyễn Cao '})
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Tuấn'})
  lastName: string;

  @Expose()
  @ApiProperty({ example: '+84' })
  phoneCode: string;

  @Expose()
  @ApiProperty({ example: '123456789' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: true })
  isOnBoardingCompleted: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'newemail@example.com' })
  email?: string;

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
