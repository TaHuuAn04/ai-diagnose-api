import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { PageDto } from "@app/core/dtos";

import { GetAppointmentResponseDto, GetListAppointmentDto } from "../dtos";
import { IAppointmentService } from "../interfaces";

export class GetListAppointmentQuery {
  constructor(
    public readonly userId: string,
    public readonly request: GetListAppointmentDto,
  ) {}
}

@QueryHandler(GetListAppointmentQuery)
export class GetListAppointmentQueryHandler 
  implements IQueryHandler<GetListAppointmentQuery, PageDto<GetAppointmentResponseDto>> 
{
  constructor(
    @Inject(INJECTION_TOKEN.APPOINTMENT_SERVICE)
    private readonly appointmentService: IAppointmentService
  ) {}

  async execute(query: GetListAppointmentQuery): Promise<PageDto<GetAppointmentResponseDto>> {
    const appointments = await this.appointmentService.getListAppointment(
      query.userId,
      query.request
    );

    return appointments;
  }
}
