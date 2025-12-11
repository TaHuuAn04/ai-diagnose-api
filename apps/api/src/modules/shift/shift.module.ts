import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { ShiftService } from "./infrastructures";
import { ShiftController } from "./shift.controller";
import { BookShiftCommandHandler } from "./use-cases/book-shift.use-case";
import { GetAvailableShiftsByDoctorQueryHandler } from "./use-cases/get-available-shifts-by-doctor.use-case";
import { GetListShiftQueryHandler } from "./use-cases/get-list-shift.use-case";


const Handlers = [
  GetListShiftQueryHandler,
  GetAvailableShiftsByDoctorQueryHandler,
  BookShiftCommandHandler,
];

const Adapters = [
  {
    provide: INJECTION_TOKEN.SHIFT_SERVICE,
    useClass: ShiftService,
  }
];

@Module({  
  imports: [CqrsModule],
  controllers: [ShiftController],
  providers: [...Adapters, ...Handlers],
  exports: [...Adapters, ...Handlers],
})
export class ShiftModule {}