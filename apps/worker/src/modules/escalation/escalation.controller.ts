import { Body, Controller, Post } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import {
  SendSupportEscalationTicketBodyDto,
  SendSupportEscalationTicketResponseDto,
} from './dtos';
import { EscalationQueueProvider } from './queues/escalation-queue.provider';

@Controller('escalation')
export class EscalationController {
  constructor(
    private readonly escalationQueueProvider: EscalationQueueProvider,
  ) {}

  @Post('send-support-ticket')
  async sendSupportTicket(
    @Body() body: SendSupportEscalationTicketBodyDto,
  ): Promise<SendSupportEscalationTicketResponseDto> {
    await this.escalationQueueProvider.sendSupportEscalationTicketEmail(body);

    return plainToInstance(SendSupportEscalationTicketResponseDto, {
      result: true,
    });
  }
}
