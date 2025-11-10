import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { Job, Queue } from 'bullmq';

import { SendSupportEscalationTicketInputDto } from '../dtos';

import { ESCALATION_QUEUE, EscalationJobData } from '.';

@Injectable()
export class EscalationQueueProvider {
  constructor(
    @InjectQueue(ESCALATION_QUEUE.NAME)
    private readonly escalationQueue: Queue<EscalationJobData>,
  ) {}

  async sendSupportEscalationTicketEmail(
    input: SendSupportEscalationTicketInputDto,
  ): Promise<Job<EscalationJobData>> {
    return this.escalationQueue.add(
      ESCALATION_QUEUE.JOBS.SEND_SUPPORT_TICKET_EMAIL,
      input,
    );
  }
}
