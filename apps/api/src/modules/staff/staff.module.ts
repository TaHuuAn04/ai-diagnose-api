import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";
import { StaffController } from "./staff.controller";
import { StaffService } from "./infrastructures";
import { GetActiveDoctorsQueryHandler, GetTodayAppointmentsQueryHandler } from "./use-cases";


const Handlers = [
  // Add command handlers here in the future
  GetTodayAppointmentsQueryHandler,
  GetActiveDoctorsQueryHandler
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