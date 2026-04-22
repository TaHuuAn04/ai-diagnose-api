import { ApiProperty } from '@nestjs/swagger';

import { User } from 'apps/api/src/infrastructure/database/typeorm-nest/entities';
import { IsEmail, IsNotEmpty, IsNumberString, IsString, IsNumber } from 'class-validator';

export class LoginOtpDto {
  @IsNumberString()
  @IsNotEmpty()
  @ApiProperty({ example: 1234 })
  otp: string;

  @IsNotEmpty()
  user: User;
}

export class RegisterOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  otp: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  expiresInMinutes: number;
}

export class ForgotPasswordOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  resetUrl: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  expiresInMinutes: number;
}
