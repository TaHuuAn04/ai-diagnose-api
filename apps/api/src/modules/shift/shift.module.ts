import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { ShiftService } from "./infrastructures";
import { ShiftController } from "./shift.controller";
import { GetListShiftQueryHandler } from "./use-cases/get-list-shift.use-case";


const Handlers = [
  // Add command handlers here in the future
  GetListShiftQueryHandler
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