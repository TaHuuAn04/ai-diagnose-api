import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IDoctorService } from '../doctor.interface';
import { DoctorDashboardStatisticsDto, GetDoctorDashboardRequestDto } from '../dtos';

export class GetDoctorDashboardStatisticsQuery implements IQuery {
  constructor(
    public readonly doctorId: string,
    public readonly input: GetDoctorDashboardRequestDto
  ) { }
}

@QueryHandler(GetDoctorDashboardStatisticsQuery)
export class GetDoctorDashboardStatisticsQueryHandler
  implements IQueryHandler<GetDoctorDashboardStatisticsQuery, DoctorDashboardStatisticsDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService
  ) {}

  async execute(query: GetDoctorDashboardStatisticsQuery): Promise<DoctorDashboardStatisticsDto> {
    const result = await this.doctorService.getDoctorDashboardStatistics(
      query.doctorId,
      query.input
    );

    return result;
  }
}
