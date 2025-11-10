import { ApiProperty } from '@nestjs/swagger';

import { User } from 'apps/api/src/infrastructure/database/typeorm-nest/entities';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

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
}
