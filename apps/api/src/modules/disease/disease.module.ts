import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { DiseaseController } from './disease.controller'

const Handlers = [
];

@Module({
  imports: [CqrsModule],
  controllers: [DiseaseController],
  providers: [...Handlers],
})
export class DiseaseModule {}
