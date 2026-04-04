import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Novu } from '@novu/node';

import { NovuConfig } from '../../configs';
import { SendSupportEscalationTicketInputDto } from '../escalation/dtos';

import { NOVU_QUEUE_JOBS } from './queues';

@Injectable()
export class TriggerNovuService extends Novu {
  constructor(
    @Inject(NovuConfig.KEY)
    private readonly config: ConfigType<typeof NovuConfig>,
  ) {
    super(config.novuApiKey || 'mock_key_for_ignore', { backendUrl: config.novuServerUrl || 'http://localhost:3000' });
  }

  async sendSupportEscalationTicketToSubscriber(
    input: SendSupportEscalationTicketInputDto,
  ): Promise<void> {
    if (!this.config.novuApiKey) {
      console.warn('NOVU_API_KEY is not set. Ignoring Novu trigger: ', NOVU_QUEUE_JOBS.SEND_SUPPORT_ESCALATION_TICKET);
      return;
    }

    await this.trigger(NOVU_QUEUE_JOBS.SEND_SUPPORT_ESCALATION_TICKET, {
      to: {
        subscriberId: input.clientUserId,
        email: input.clientEmail,
      },
      payload: {
        ...input,
      },
    });
  }
}
