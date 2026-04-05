import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { GetTodayAppointmentsRequestDto, StaffDashboardStatisticsDto } from '../dtos';
import { IStaffService } from '../interfaces'

export class GetStaffInfoDashboardQuery implements IQuery {
  constructor(
    public readonly staffId: string,
    public readonly request: GetTodayAppointmentsRequestDto
  ) { }
}

@QueryHandler(GetStaffInfoDashboardQuery)
export class GetStaffInfoDashboardQueryHandler
  implements IQueryHandler<GetStaffInfoDashboardQuery, StaffDashboardStatisticsDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(query: GetStaffInfoDashboardQuery): Promise<StaffDashboardStatisticsDto> {
    const result = await this.staffService.getStaffInfoDashboard(
      query.staffId,
      query.request
    );

    return result;
  }
}
