import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { AppointmentStatus } from "@app/core/domain/enums";

import { GetAppointmentResponseDto } from "../dtos";
import { IAppointmentService } from "../interfaces";

export class GetAppointmentsPublicQuery {
  constructor(
    public readonly userId: string,
    public readonly status?: AppointmentStatus,
  ) {}
}

@QueryHandler(GetAppointmentsPublicQuery)
export class GetAppointmentsPublicQueryHandler
  implements IQueryHandler<GetAppointmentsPublicQuery, GetAppointmentResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.APPOINTMENT_SERVICE)
    private readonly appointmentService: IAppointmentService
  ) {}

  async execute(query: GetAppointmentsPublicQuery): Promise<GetAppointmentResponseDto[]> {
    return this.appointmentService.getAppointmentsPublic(query.userId, query.status);
  }
}
