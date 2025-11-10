import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

import { LoginOtpDto, NovuUserDto, RegisterOtpDto } from './dtos';
import {
  CreateNovuUserCommand,
  SendLoginOtpCommand,
  SendRegisterOtpCommand,
} from './use-cases';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private commandBus: CommandBus) {}

  @Post('send-login-otp')
  async sendLoginOtpMail(@Body() input: LoginOtpDto): Promise<void> {
    const command = new SendLoginOtpCommand(input);
    await this.commandBus.execute(command);
  }

  @Post('send-register-otp')
  async sendRegisterOtpMail(@Body() input: RegisterOtpDto): Promise<void> {
    const command = new SendRegisterOtpCommand(input);
    await this.commandBus.execute(command);
  }

  @Post('create-novu-user')
  async createNovuUser(@Body() input: NovuUserDto): Promise<void> {
    const command = new CreateNovuUserCommand(input);
    await this.commandBus.execute(command);
  }
}
