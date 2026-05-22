import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { plainToInstance } from 'class-transformer';

import { IsPublic } from '@app/core/decorators';

import {
  ForgotPasswordRequestDto,
  LoginBodyDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  RequestLoginDto,
  RequestOtpResponseDto,
  ResetPasswordRequestDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
} from './dtos';
import { TempAuthService } from './infrastructures/temp-auth.service';
import {
  ForgotPasswordCommand,
  RequestOtpCommand,
  ResetPasswordCommand,
  VerifyOtpCommand,
} from './use-cases';
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

  @Post('verify-otp')
  @IsPublic()
  async verifyOTP(
    @Body() input: VerifyOtpRequestDto,
  ): Promise<VerifyOtpResponseDto> {
    const command = new VerifyOtpCommand(input);
    return await this.commandBus.execute(command);
  }

  @Post('forgot-password')
  @IsPublic()
  async forgotPassword(
    @Body() input: ForgotPasswordRequestDto,
  ): Promise<RequestOtpResponseDto> {
    const command = new ForgotPasswordCommand(input);
    return await this.commandBus.execute(command);
  }

  @Post('reset-password')
  @IsPublic()
  async resetPassword(
    @Body() input: ResetPasswordRequestDto,
  ): Promise<boolean> {
    const command = new ResetPasswordCommand(input);
    return await this.commandBus.execute(command);
  }

  // @Throttle({ default: { limit: 10, ttl: 60000 } })
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
