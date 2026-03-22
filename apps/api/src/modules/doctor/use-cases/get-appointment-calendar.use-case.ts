import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IDoctorService } from '../doctor.interface';
import { GetAppointmentCalendarRequestDto, GetAppointmentCalendarResponseDto } from '../dtos';

export class GetAppointmentCalendarQuery implements IQuery {
  constructor(
    public readonly doctorId: string,
    public readonly request: GetAppointmentCalendarRequestDto
  ) {}
}

@QueryHandler(GetAppointmentCalendarQuery)
export class GetAppointmentCalendarQueryHandler
  implements IQueryHandler<GetAppointmentCalendarQuery, GetAppointmentCalendarResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService
  ) {}

  async execute(query: GetAppointmentCalendarQuery): Promise<GetAppointmentCalendarResponseDto[]> {
    return await this.doctorService.getAppointmentCalendar(query.doctorId, query.request);
  }
}
