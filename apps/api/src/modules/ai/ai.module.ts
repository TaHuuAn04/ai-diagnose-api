import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AIController } from './ai.controller';

@Module({
  imports: [CqrsModule],
  controllers: [AIController],
  providers: [],
})
export class AIModule {}
