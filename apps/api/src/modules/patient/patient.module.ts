import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { PatientController } from './patient.controller'

const Handlers = [
];

@Module({
  imports: [CqrsModule],
  controllers: [PatientController],
  providers: [...Handlers],
})
export class PatientModule {}
