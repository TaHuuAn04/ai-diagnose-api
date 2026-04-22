import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'http://localhost:5173/reset-password' })
  resetUrl: string;
}

export class ResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '04b65d85-7c56-43fe-b0ef-7287256ec94d' })
  token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password123' })
  newPassword: string;
}
