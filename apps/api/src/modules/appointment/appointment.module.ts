import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { AppointmentController } from "./appointment.controller";
import { AppointmentService } from "./infrastructures";
import { GetListAppointmentQueryHandler } from "./use-cases";

const Handlers = [
  GetListAppointmentQueryHandler,
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.APPOINTMENT_SERVICE,
    useClass: AppointmentService,
  }
];

@Module({
  imports: [CqrsModule],
  controllers: [AppointmentController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class AppointmentModule {}
