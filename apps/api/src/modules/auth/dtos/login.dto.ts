import { ApiProperty } from '@nestjs/swagger';

import { AuthFunc } from 'apps/api/src/common/enums';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginBodyDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: '2qBbV@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'password' })
  password: string;
}

@Exclude()
export class LoginResponseDto {
  @Expose()
  accessToken: string;
}

export class RequestLoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: '2qBbV@example.com' })
  email: string;
}

@Exclude()
export class RequestLoginResponseDto {
  @Expose()
  sessionId: string;

  @Expose()
  expireTime: number;

  @Expose()
  func: AuthFunc;
}
