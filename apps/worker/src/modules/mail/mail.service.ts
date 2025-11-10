import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { SendSupportEscalationTicketInputDto } from '../escalation/dtos';

import { SendSupportEscalationTicketCommand } from './use-cases';

@Injectable()
export class MailService {
  constructor(private readonly commandBus: CommandBus) {}

  async sendSupportEscalationTicket(
    input: SendSupportEscalationTicketInputDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new SendSupportEscalationTicketCommand(input),
    );
  }
}
