import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { IsPublic } from '@app/core/decorators';

import {
  LoginBodyDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  RequestLoginDto,
  RequestOtpResponseDto,
  VerifyOtpRequestDto,
} from './dtos';
import { TempAuthService } from './infrastructures/temp-auth.service';
import { RequestOtpCommand, VerifyLoginOtpCommand } from './use-cases';
import { RegisterCommand } from './use-cases/register.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: TempAuthService,
    private commandBus: CommandBus,
  ) {}

  @Post('register')
  @IsPublic()
  async register(
    @Body() input: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const command = new RegisterCommand(input);
    return await this.commandBus.execute(command);
  }

  @Post('request-otp')
  @IsPublic()
  async requestOTP(
    @Body() input: RequestLoginDto,
  ): Promise<RequestOtpResponseDto> {
    const command = new RequestOtpCommand(input);
    return await this.commandBus.execute(command);
  }

  @Post('verify-login-otp')
  @IsPublic()
  async verifyOTP(
    @Body() input: VerifyOtpRequestDto,
  ): Promise<LoginResponseDto> {
    const command = new VerifyLoginOtpCommand(input);
    return await this.commandBus.execute(command);
  }

  @Post('login')
  @IsPublic()
  async login(@Body() dto: LoginBodyDto): Promise<LoginResponseDto> {
    const token = await this.authService.login(dto);
    const result = {
      accessToken: token,
    };

    return plainToInstance(LoginResponseDto, result);
  }
}
