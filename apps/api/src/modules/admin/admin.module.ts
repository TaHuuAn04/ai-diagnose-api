import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AdminController } from './admin.controller'
 
const Handlers = [
];

@Module({
  imports: [CqrsModule],
  controllers: [AdminController],
  providers: [...Handlers],
})
export class AdminModule {}
