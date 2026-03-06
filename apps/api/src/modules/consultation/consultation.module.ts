import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data";

import { ConsultationController } from "./consultation.controller";
import { ConsultationService } from "./infrastructures";
import { GetConsultationHistoryQueryHandler} from "./use-cases";

const Handlers = [
  GetConsultationHistoryQueryHandler
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.CONSULTATION_SERVICE,
    useClass: ConsultationService,
  },
];

@Module({
  imports: [CqrsModule, 
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
    }),
  ],
  controllers: [ConsultationController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class ConsultationModule {}
