import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { AiInternalServerError, Exception } from '@app/core/exception';

import { SendSupportEscalationTicketInputDto } from '../../escalation/dtos';
import { TriggerNovuService } from '../../novu/novu-trigger.service';

export class SendSupportEscalationTicketCommand implements ICommand {
  constructor(public readonly input: SendSupportEscalationTicketInputDto) {}
}

@CommandHandler(SendSupportEscalationTicketCommand)
export class SendSupportEscalationTicketCommandHandler
  implements ICommandHandler<SendSupportEscalationTicketCommand, void>
{
  constructor(private readonly triggerNovuService: TriggerNovuService) {}

  async execute(command: SendSupportEscalationTicketCommand): Promise<void> {
    try {
      const { input } = command;

      await this.triggerNovuService.sendSupportEscalationTicketToSubscriber(
        input,
      );
    } catch (error) {
      if (error instanceof Exception) {
        throw error;
      }

      throw new AiInternalServerError(
        (error.message ||
          'Failed to send support escalation ticket email') as string,
      );
    }
  }
}
