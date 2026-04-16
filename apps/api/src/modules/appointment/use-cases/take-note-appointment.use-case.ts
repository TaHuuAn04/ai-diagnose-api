import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { UpdateOrDeleteResponseDto } from "../../../common/dtos";
import { TakeNoteAppointmentDto } from "../dtos";
import { IAppointmentService } from "../interfaces";

export class TakeNoteAppointmentCommand {
  constructor(
    public readonly userId: string,
    public readonly appointmentId: string,
    public readonly input: TakeNoteAppointmentDto,
  ) {}
}

@CommandHandler(TakeNoteAppointmentCommand)
export class TakeNoteAppointmentCommandHandler 
  implements ICommandHandler<TakeNoteAppointmentCommand, UpdateOrDeleteResponseDto> 
{
  constructor(
    @Inject(INJECTION_TOKEN.APPOINTMENT_SERVICE)
    private readonly appointmentService: IAppointmentService
  ) {}

  async execute(command: TakeNoteAppointmentCommand): Promise<UpdateOrDeleteResponseDto> {
    const result = await this.appointmentService.takeNoteAppointment(
      command.userId,
      command.appointmentId,
      command.input
    );

    return result;
  }
}
