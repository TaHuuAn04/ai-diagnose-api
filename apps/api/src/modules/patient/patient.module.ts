import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { PatientService } from "./infrastructures";
import { PatientController } from "./patient.controller";
import { CreatePatientCommandHandler, GetInfoQueryHandler } from "./use-cases";


const Handlers = [
  // Add command handlers here in the future
  GetInfoQueryHandler,
  CreatePatientCommandHandler
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.PATIENT_SERVICE,
    useClass: PatientService,
  }
];

@Module({  
  imports: [CqrsModule],
  controllers: [PatientController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class PatientModule {}