import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AiInternalServerError, Exception } from '@app/core/exception';

import { MailService } from '../../mail/mail.service';
import { SendSupportEscalationTicketInputDto } from '../dtos';

export class ProcessSendSupportEscalationTicketCommand implements ICommand {
  constructor(public readonly input: SendSupportEscalationTicketInputDto) {}
}

@CommandHandler(ProcessSendSupportEscalationTicketCommand)
export class ProcessSendSupportEscalationTicketCommandHandler
  implements ICommandHandler<ProcessSendSupportEscalationTicketCommand, void>
{
  constructor(private readonly mailService: MailService) {}

  async execute(
    command: ProcessSendSupportEscalationTicketCommand,
  ): Promise<void> {
    try {
      const { input } = command;
      await this.mailService.sendSupportEscalationTicket(input);
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AiInternalServerError(
        (error?.message || 'Error sending email') as string,
      );
    }
  }
}
