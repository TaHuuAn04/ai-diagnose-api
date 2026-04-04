import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IStaffService } from '../interfaces'
import { GetTodayAppointmentsRequestDto, GetTodayAppointmentsResponseDto } from '../dtos';

export class GetTodayAppointmentsQuery implements IQuery {
  constructor(
    public readonly staffId: string,
    public readonly request: GetTodayAppointmentsRequestDto
  ) { }
}

@QueryHandler(GetTodayAppointmentsQuery)
export class GetTodayAppointmentsQueryHandler
  implements IQueryHandler<GetTodayAppointmentsQuery, GetTodayAppointmentsResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(query: GetTodayAppointmentsQuery): Promise<GetTodayAppointmentsResponseDto[]> {
    const result = await this.staffService.getTodayAppointments(
      query.staffId,
      query.request
    );

    return result;
  }
}
