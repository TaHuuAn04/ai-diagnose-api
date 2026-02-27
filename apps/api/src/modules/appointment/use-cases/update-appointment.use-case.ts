import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { UpdateOrDeleteResponseDto } from "../../../common/dtos";
import { UpdateAppointmentDto } from "../dtos";
import { IAppointmentService } from "../interfaces";

export class UpdateAppointmentCommand {
  constructor(
    public readonly appointmentId: string,
    public readonly input: UpdateAppointmentDto,
  ) {}
}

@CommandHandler(UpdateAppointmentCommand)
export class UpdateAppointmentCommandHandler 
  implements ICommandHandler<UpdateAppointmentCommand, UpdateOrDeleteResponseDto> 
{
  constructor(
    @Inject(INJECTION_TOKEN.APPOINTMENT_SERVICE)
    private readonly appointmentService: IAppointmentService
  ) {}

  async execute(command: UpdateAppointmentCommand): Promise<UpdateOrDeleteResponseDto> {
    const result = await this.appointmentService.updateAppointment(
      command.appointmentId,
      command.input
    );

    return result;
  }
}
