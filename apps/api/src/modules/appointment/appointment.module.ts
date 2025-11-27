import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AppointmentController } from './appointment.controller';

const Handlers = [
];

@Module({
  imports: [CqrsModule],
  controllers: [AppointmentController],
  providers: [...Handlers],
})
export class AppointmentModule {}
