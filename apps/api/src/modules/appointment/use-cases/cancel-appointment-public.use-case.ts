import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { UpdateOrDeleteResponseDto } from "../../../common/dtos";
import { IAppointmentService } from "../interfaces";

export class CancelAppointmentPublicCommand {
  constructor(
    public readonly appointmentId: string,
    public readonly patientId: string,
  ) {}
}

@CommandHandler(CancelAppointmentPublicCommand)
export class CancelAppointmentPublicCommandHandler
  implements ICommandHandler<CancelAppointmentPublicCommand, UpdateOrDeleteResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.APPOINTMENT_SERVICE)
    private readonly appointmentService: IAppointmentService
  ) {}

  async execute(command: CancelAppointmentPublicCommand): Promise<UpdateOrDeleteResponseDto> {
    return this.appointmentService.cancelAppointmentPublic(
      command.appointmentId,
      command.patientId,
    );
  }
}
