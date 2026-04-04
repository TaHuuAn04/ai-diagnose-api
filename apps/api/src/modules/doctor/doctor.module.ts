import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { DoctorController } from "./doctor.controller";
import { DoctorService } from "./infrastructures";
import {
  CreateAiDiagnosisCommandHandler,
  FinishExaminationCommandHandler,
  GetAiDiagnosisResultQueryHandler,
  GetAppointmentCalendarQueryHandler,
  GetAppointmentDatesQueryHandler,
  GetDoctorDashboardStatisticsQueryHandler,
 GetDoctorInfoQueryHandler, GetListDoctorQueryHandler,
 GetPersonalAppointmentsQueryHandler,
 HandleAiDiagnosisCallbackCommandHandler,
 StartExaminationCommandHandler} from "./use-cases";

const Handlers = [
  GetListDoctorQueryHandler,
  GetDoctorInfoQueryHandler,
  GetPersonalAppointmentsQueryHandler,
  GetAppointmentCalendarQueryHandler,
  GetAppointmentDatesQueryHandler,
  GetDoctorDashboardStatisticsQueryHandler,
  GetAppointmentDatesQueryHandler,
  CreateAiDiagnosisCommandHandler,
  GetAiDiagnosisResultQueryHandler,
  HandleAiDiagnosisCallbackCommandHandler,
  StartExaminationCommandHandler,
  FinishExaminationCommandHandler
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.DOCTOR_SERVICE,
    useClass: DoctorService,
  }
];

@Module({  
  imports: [CqrsModule, HttpModule],
  controllers: [DoctorController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class DoctorModule {}
