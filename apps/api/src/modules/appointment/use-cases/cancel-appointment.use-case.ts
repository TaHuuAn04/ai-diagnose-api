import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { UpdateOrDeleteResponseDto } from "../../../common/dtos";
import { IAppointmentService } from "../interfaces";

export class CancelAppointmentCommand {
  constructor(
    public readonly appointmentId: string,
  ) {}
}

@CommandHandler(CancelAppointmentCommand)
export class CancelAppointmentCommandHandler 
  implements ICommandHandler<CancelAppointmentCommand, UpdateOrDeleteResponseDto> 
{
  constructor(
    @Inject(INJECTION_TOKEN.APPOINTMENT_SERVICE)
    private readonly appointmentService: IAppointmentService
  ) {}

  async execute(command: CancelAppointmentCommand): Promise<UpdateOrDeleteResponseDto> {
    const result = await this.appointmentService.cancelAppointment(command.appointmentId);

    return result;
  }
}
