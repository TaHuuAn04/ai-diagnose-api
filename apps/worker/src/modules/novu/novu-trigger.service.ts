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
    super(config.novuApiKey, { backendUrl: config.novuServerUrl });
  }

  async sendSupportEscalationTicketToSubscriber(
    input: SendSupportEscalationTicketInputDto,
  ): Promise<void> {
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
