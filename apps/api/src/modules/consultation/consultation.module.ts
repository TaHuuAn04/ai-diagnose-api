import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ConsultingController } from './consultation.controller';

const Handlers = [
];

@Module({
  imports: [CqrsModule],
  controllers: [ConsultingController],
  providers: [...Handlers],
})
export class ConsultationModule {}
