import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { UserRole } from "@app/core/domain/enums";

import { UpdateOrDeleteResponseDto } from "../../../common/dtos";
import { IAppointmentService } from "../interfaces";

export class CancelAppointmentCommand {
  constructor(
    public readonly userId: string,
    public readonly role: UserRole,
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
    const result = await this.appointmentService.cancelAppointment(
      command.userId,
      command.role,
      command.appointmentId
    );

    return result;
  }
}
