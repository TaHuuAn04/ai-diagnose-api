import { AiTemplateModule } from './modules/ai-template/ai-template.module';
import { DifyDatasetTemplateModule } from './modules/dify-dataset-template/dify-dataset-template.module';
import { EscalationModule } from './modules/escalation/escalation.module';
import { HealthModule } from './modules/health/health.module';
import { MailModule } from './modules/mail/mail.module';
import { NovuModule } from './modules/novu/novu.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

export const modules = [
  NovuModule,
  MailModule,
  AiTemplateModule,
  EscalationModule,
  HealthModule,
  WebhooksModule,
  DifyDatasetTemplateModule,
];
