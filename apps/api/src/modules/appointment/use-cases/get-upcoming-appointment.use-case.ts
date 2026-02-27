import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { GetAppointmentResponseDto } from "../dtos";
import { IAppointmentService } from "../interfaces";

export class GetUpcomingAppointmentQuery {
  constructor(
    public readonly userId: string
  ) {}
}

@QueryHandler(GetUpcomingAppointmentQuery)
export class GetUpcomingAppointmentQueryHandler 
  implements IQueryHandler<GetUpcomingAppointmentQuery, GetAppointmentResponseDto | null> 
{
  constructor(
    @Inject(INJECTION_TOKEN.APPOINTMENT_SERVICE)
    private readonly appointmentService: IAppointmentService
  ) {}

  async execute(query: GetUpcomingAppointmentQuery): Promise<GetAppointmentResponseDto | null> {
    const appointment = await this.appointmentService.getUpcomingAppointment(
      query.userId
    );

    return appointment;
  }
}
