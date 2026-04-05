import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { StaffService } from "./infrastructures";
import { StaffController } from "./staff.controller";
import {
  GetActiveDoctorsQueryHandler,
  GetListAppointmentsQueryHandler,
  GetScheduleQueryHandler,
  GetStaffInfoDashboardQueryHandler, GetTodayAppointmentsQueryHandler
} from "./use-cases";


const Handlers = [
  // Add command handlers here in the future
  GetTodayAppointmentsQueryHandler,
  GetActiveDoctorsQueryHandler,
  GetListAppointmentsQueryHandler,
  GetStaffInfoDashboardQueryHandler,
  GetScheduleQueryHandler
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.STAFF_SERVICE,
    useClass: StaffService,
  }
];

@Module({  
  imports: [CqrsModule],
  controllers: [StaffController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class StaffModule {}