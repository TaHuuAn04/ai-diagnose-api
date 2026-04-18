import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";

import { StaffService } from "./infrastructures";
import { StaffController } from "./staff.controller";
import {
  CreateScheduleCommandHandler,
  DeleteScheduleCommandHandler,
  ExportScheduleToCSVQueryHandler,
  GetActiveDoctorsQueryHandler,
  GetListAppointmentsQueryHandler,
  GetScheduleQueryHandler,
  GetStaffInfoDashboardQueryHandler,
  GetStaffInfoQueryHandler,
  GetTodayAppointmentsQueryHandler,
  ImportScheduleFromCSVCommandHandler,
  UpdateScheduleCommandHandler,
  UpdateStaffInfoCommandHandler
} from "./use-cases";

const Handlers = [
  // Add command handlers here in the future
  GetTodayAppointmentsQueryHandler,
  GetActiveDoctorsQueryHandler,
  GetListAppointmentsQueryHandler,
  GetStaffInfoDashboardQueryHandler,
  GetScheduleQueryHandler,
  ImportScheduleFromCSVCommandHandler,
  CreateScheduleCommandHandler,
  ExportScheduleToCSVQueryHandler,
  DeleteScheduleCommandHandler,
  UpdateScheduleCommandHandler,
  GetStaffInfoQueryHandler,
  UpdateStaffInfoCommandHandler
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.STAFF_SERVICE,
    useClass: StaffService,
  }
];

@Module({  
  imports: [CqrsModule,
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
    }),
  ],
  controllers: [StaffController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class StaffModule {}