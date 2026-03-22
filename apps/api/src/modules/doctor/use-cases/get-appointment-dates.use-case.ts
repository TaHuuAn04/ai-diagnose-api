import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IDoctorService } from '../doctor.interface';
import { GetAppointmentCalendarResponseDto } from '../dtos';

export class GetAppointmentDatesQuery {
  constructor(
    public readonly doctorId: string,
    public readonly date: string,
  ) {}
}

@QueryHandler(GetAppointmentDatesQuery)
export class GetAppointmentDatesQueryHandler
  implements IQueryHandler<GetAppointmentDatesQuery, GetAppointmentCalendarResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService,
  ) {}

  async execute(
    query: GetAppointmentDatesQuery,
  ): Promise<GetAppointmentCalendarResponseDto> {
    const { doctorId, date } = query;
    return this.doctorService.getAppointmentDates(doctorId, date);
  }
}
