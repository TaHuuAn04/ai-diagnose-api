import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { GetSystemOverviewRequestDto, SystemOverviewResponseDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class GetSystemOverviewQuery {
  constructor(public readonly query: GetSystemOverviewRequestDto) {}
}

@QueryHandler(GetSystemOverviewQuery)
export class GetSystemOverviewQueryHandler
  implements IQueryHandler<GetSystemOverviewQuery, SystemOverviewResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(queryOption: GetSystemOverviewQuery): Promise<SystemOverviewResponseDto> {
    const { query } = queryOption;
    return this.adminService.getSystemOverview(query);
  }
}
