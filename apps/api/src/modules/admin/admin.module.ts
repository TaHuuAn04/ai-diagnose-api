import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { AdminController } from './admin.controller';
import { AdminService } from './infrastructures';
import {
  CreateAdmissionStaffAccountCommandHandler,
  CreateDoctorAccountCommandHandler,
} from './use-cases';

const Handlers = [
  CreateDoctorAccountCommandHandler,
  CreateAdmissionStaffAccountCommandHandler,
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.ADMIN_SERVICE,
    useClass: AdminService,
  },
];

@Module({
  imports: [CqrsModule],
  controllers: [AdminController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class AdminModule {}
