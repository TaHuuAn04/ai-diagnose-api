import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { UserRole } from '@app/core/domain/enums';

export class RegisterRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: '2qBbV@example.com' })
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ example: 1111 })
  otp: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: 'bf1b85cf-d188-4e3c-8963-bdca8fe029bd' })
  sessionId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'John' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ValidateIf((dto: RegisterRequestDto) => !!dto.phoneNumber)
  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  @ApiProperty({ example: '+84' })
  phoneCode: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  @MinLength(9)
  @ApiProperty({ example: '123456789' })
  phoneNumber: string;
}

@Exclude()
export class RegisterResponseDto {
  @Expose()
  @ApiProperty({example: 'bf1b85cf-d188-4e3c-8963-bdca8fe029bd'})
  id: string;

  @Expose()
  @ApiProperty({ example: '2qBbV@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'Nguyễn Cao' })
  firstName: string;

  @Expose()
  @ApiProperty({ example: 'Tuấn' })  
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'DOCTOR'})
  role: UserRole;

  @Expose()
  @ApiProperty({ example: '+84' })
  phoneCode: string;

  @Expose()
  @ApiProperty({ example: '123456789' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: 'bf1b85cf-d188-4e3c-8963-bdca8fe029bd' })  
  sessionId: string;
}
