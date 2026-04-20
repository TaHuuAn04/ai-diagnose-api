import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { GetDoctorPatientsRequestDto, TopDiseaseItemResponseDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class GetTopDiseasesQuery {
  constructor(public readonly query: GetDoctorPatientsRequestDto) {} // Reuse month/year DTO
}

@QueryHandler(GetTopDiseasesQuery)
export class GetTopDiseasesQueryHandler
  implements IQueryHandler<GetTopDiseasesQuery, TopDiseaseItemResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(query: GetTopDiseasesQuery): Promise<TopDiseaseItemResponseDto[]> {
    return this.adminService.getTopDiseasesStatistics(query.query);
  }
}
