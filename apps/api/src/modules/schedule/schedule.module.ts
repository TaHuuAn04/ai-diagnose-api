import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ScheduleController } from './schedule.controller'

const Handlers = [
];

@Module({
  imports: [CqrsModule],
  controllers: [ScheduleController],
  providers: [...Handlers],
})
export class ScheduleModule {}
