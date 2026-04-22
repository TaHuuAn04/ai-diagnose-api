import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/worker/src/common/enums';

import { ForgotPasswordOtpDto } from '../dtos';
import { ISendMailService } from '../use-cases/adapters';

export class SendForgotPasswordOtpCommand {
  constructor(public readonly input: ForgotPasswordOtpDto) {}
}

@CommandHandler(SendForgotPasswordOtpCommand)
export class SendForgotPasswordOtpCommandHandler
  implements ICommandHandler<SendForgotPasswordOtpCommand, void>
{
  constructor(
    @Inject(INJECTION_TOKEN.SEND_MAIL_SERVICE)
    private readonly sendMailService: ISendMailService,
  ) {}

  async execute(command: SendForgotPasswordOtpCommand): Promise<void> {
    await this.sendMailService.sendForgotPasswordOtp(command.input);
  }
}
