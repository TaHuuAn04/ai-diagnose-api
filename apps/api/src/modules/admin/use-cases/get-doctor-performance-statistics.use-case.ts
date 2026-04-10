import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  DoctorPerformanceStatisticsResponseDto,
  GetDoctorPerformanceStatisticsRequestDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class GetDoctorPerformanceStatisticsQuery {
  constructor(public readonly query: GetDoctorPerformanceStatisticsRequestDto) {}
}

@QueryHandler(GetDoctorPerformanceStatisticsQuery)
export class GetDoctorPerformanceStatisticsQueryHandler
  implements
    IQueryHandler<
      GetDoctorPerformanceStatisticsQuery,
      DoctorPerformanceStatisticsResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    queryOption: GetDoctorPerformanceStatisticsQuery,
  ): Promise<DoctorPerformanceStatisticsResponseDto> {
    const { query } = queryOption;
    return this.adminService.getDoctorPerformanceStatistics(query);
  }
}
