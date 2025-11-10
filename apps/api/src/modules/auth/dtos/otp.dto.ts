import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';

export class RequestOtpRequestDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: '2qBbV@example.com' })
  email: string;
}

@Exclude()
export class RequestOtpResponseDto {
  @Expose()
  sessionId: string;
}

export class VerifyOtpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: '2qBbV@example.com' })
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({ example: 1111 })
  otp: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '04b65d85-7c56-43fe-b0ef-7287256ec94d' })
  sessionId: string;
}
