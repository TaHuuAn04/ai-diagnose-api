import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { DoctorController } from "./doctor.controller";
import { DoctorService } from "./infrastructures";
import { GetAppointmentCalendarQueryHandler, GetDoctorInfoQueryHandler, GetListDoctorQueryHandler, GetPersonalAppointmentsQueryHandler } from "./use-cases";
import { GetAppointmentDatesQueryHandler } from "./use-cases/get-appointment-dates.use-case";

const Handlers = [
  GetListDoctorQueryHandler,
  GetDoctorInfoQueryHandler,
  GetPersonalAppointmentsQueryHandler,
  GetAppointmentCalendarQueryHandler,
  GetAppointmentDatesQueryHandler
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.DOCTOR_SERVICE,
    useClass: DoctorService,
  }
];

@Module({  
  imports: [CqrsModule],
  controllers: [DoctorController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class DoctorModule {}
