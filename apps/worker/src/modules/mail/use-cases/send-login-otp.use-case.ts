import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/worker/src/common/enums';

import { LoginOtpDto } from '../dtos';
import { SendMailService } from '../infrastructures/send-mail.service';

export class SendLoginOtpCommand implements ICommand {
  constructor(public readonly input: LoginOtpDto) {}
}

@CommandHandler(SendLoginOtpCommand)
export class SendLoginOtpCommandHandler
  implements ICommandHandler<SendLoginOtpCommand, void>
{
  constructor(
    @Inject(INJECTION_TOKEN.SEND_MAIL_SERVICE)
    private readonly sendMailService: SendMailService,
  ) {}

  async execute(command: SendLoginOtpCommand): Promise<void> {
    await this.sendMailService.sendLoginOtp(command.input);
  }
}
