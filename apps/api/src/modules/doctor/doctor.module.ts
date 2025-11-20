import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DoctorController } from './doctor.controller';

const Handlers = [
];

@Module({
  imports: [CqrsModule],
  controllers: [DoctorController],
  providers: [...Handlers],
})
export class DoctorModule {}
