import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/worker/src/common/enums';

import { NovuUserDto } from '../dtos';
import { SendMailService } from '../infrastructures/send-mail.service';

export class CreateNovuUserCommand implements ICommand {
  constructor(public readonly input: NovuUserDto) {}
}

@CommandHandler(CreateNovuUserCommand)
export class CreateNovuUserCommandHandler
  implements ICommandHandler<CreateNovuUserCommand, void>
{
  constructor(
    @Inject(INJECTION_TOKEN.SEND_MAIL_SERVICE)
    private readonly sendMailService: SendMailService,
  ) {}

  async execute(command: CreateNovuUserCommand): Promise<void> {
    await this.sendMailService.createNovuUser(command.input);
  }
}
