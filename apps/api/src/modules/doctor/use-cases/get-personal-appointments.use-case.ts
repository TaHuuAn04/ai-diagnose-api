import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto } from '@app/core/dtos';

import { IDoctorService } from '../doctor.interface';
import { GetPersonalAppointmentsRequestDto, GetPersonalAppointmentsResponseDto } from '../dtos';

export class GetPersonalAppointmentsQuery implements IQuery {
  constructor(
    public readonly doctorId: string,
    public readonly request: GetPersonalAppointmentsRequestDto
  ) { }
}

@QueryHandler(GetPersonalAppointmentsQuery)
export class GetPersonalAppointmentsQueryHandler
  implements IQueryHandler<GetPersonalAppointmentsQuery, PageDto<GetPersonalAppointmentsResponseDto>>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService
  ) {}

  async execute(query: GetPersonalAppointmentsQuery): Promise<PageDto<GetPersonalAppointmentsResponseDto>> {
    const result = await this.doctorService.getPersonalAppointments(
      query.doctorId,
      query.request
    );

    return result;
  }
}
