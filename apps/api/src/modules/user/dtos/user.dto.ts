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
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'USER' })
  role: UserRole;

  @Expose()
  @ApiProperty({ example: 'John' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'MALE' })
  gender: UserGender; 

  @Expose()
  @ApiProperty({ example: '1990-01-15' })
  dateOfBirth?: string | null;

  @Expose()
  @ApiProperty({ example: '+84' })
  phoneCode?: string | null;

  @Expose()
  @ApiProperty({ example: '0123456789' })
  phoneNumber?: string | null;
  
  @Expose()
  @ApiProperty({ example: 'https://www.google.com/search?sca_esv=73b20ffd545e0371&sxsrf' })
  avatarUrl?: string | null;

  @Expose()
  @ApiProperty({ example: true })
  isOnBoardingCompleted?: boolean | null;
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
