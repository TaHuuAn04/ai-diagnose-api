import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";

import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./infrastructures";
import { CancelAppointmentCommandHandler, GetListAppointmentQueryHandler, GetUpcomingAppointmentQueryHandler, TakeNoteAppointmentCommandHandler, UpdateAppointmentCommandHandler } from "./use-cases";

const Handlers = [
  GetListAppointmentQueryHandler,
  CancelAppointmentCommandHandler,
  UpdateAppointmentCommandHandler,
  GetUpcomingAppointmentQueryHandler,
  TakeNoteAppointmentCommandHandler,
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.APPOINTMENT_SERVICE,
    useClass: AppointmentService,
  }
];

@Module({
  imports: [CqrsModule, 
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
    }),
  ],
  controllers: [AppointmentController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class AppointmentModule {}
