import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { MailModule } from '../mail/mail.module';

import { EscalationController } from './escalation.controller';
import { ESCALATION_QUEUE } from './queues';
import { EscalationQueueConsumer } from './queues/escalation-queue.consumer';
import { EscalationQueueListener } from './queues/escalation-queue.listener';
import { EscalationQueueProvider } from './queues/escalation-queue.provider';
import { ProcessSendSupportEscalationTicketCommandHandler } from './use-cases';

const Handlers = [ProcessSendSupportEscalationTicketCommandHandler];

@Module({
  imports: [
    CqrsModule,
    MailModule,
    BullModule.registerQueue({
      name: ESCALATION_QUEUE.NAME,
      defaultJobOptions: {
        removeOnComplete: {
          count: 1000,
        },
        attempts: 1,
      },
    }),
  ],
  controllers: [EscalationController],
  providers: [
    ...Handlers,
    EscalationQueueProvider,
    EscalationQueueConsumer,
    EscalationQueueListener,
  ],
})
export class EscalationModule {}
