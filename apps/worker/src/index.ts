import { AiDiagnosisModule } from './modules/ai-diagnosis/ai-diagnosis.module';
import { EscalationModule } from './modules/escalation/escalation.module';
import { MailModule } from './modules/mail/mail.module';
// import { NovuModule } from './modules/novu/novu.module';

export const modules = [
  // NovuModule,
  MailModule,
  EscalationModule,
  AiDiagnosisModule,
];
