import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/worker/src/common/enums';

import { RegisterOtpDto } from '../dtos';
import { SendMailService } from '../infrastructures/send-mail.service';

export class SendRegisterOtpCommand implements ICommand {
  constructor(public readonly input: RegisterOtpDto) {}
}

@CommandHandler(SendRegisterOtpCommand)
export class SendRegisterOtpCommandHandler
  implements ICommandHandler<SendRegisterOtpCommand, void>
{
  constructor(
    @Inject(INJECTION_TOKEN.SEND_MAIL_SERVICE)
    private readonly sendMailService: SendMailService,
  ) {}

  async execute(command: SendRegisterOtpCommand): Promise<void> {
    await this.sendMailService.sendRegisterOtp(command.input);
  }
}
