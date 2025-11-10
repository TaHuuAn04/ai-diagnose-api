import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '../../common/enums';
import { NovuModule } from '../novu/novu.module';

import { SendMailService } from './infrastructures/send-mail.service';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { SendSupportEscalationTicketCommandHandler } from './use-cases';
import { CreateNovuUserCommandHandler } from './use-cases/create-novu-user.use-case';
import { SendLoginOtpCommandHandler } from './use-cases/send-login-otp.use-case';
import { SendRegisterOtpCommandHandler } from './use-cases/send-register-otp.use-case';

const Adapters = [
  {
    provide: INJECTION_TOKEN.SEND_MAIL_SERVICE,
    useClass: SendMailService,
  },
];

const Handlers = [
  SendLoginOtpCommandHandler,
  SendRegisterOtpCommandHandler,
  CreateNovuUserCommandHandler,
  SendSupportEscalationTicketCommandHandler,
];

@Module({
  imports: [CqrsModule, NovuModule],
  providers: [...Adapters, ...Handlers, MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
