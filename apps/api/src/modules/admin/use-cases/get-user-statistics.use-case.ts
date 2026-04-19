import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { UserStatisticsResponseDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class GetUserStatisticsQuery {}

@QueryHandler(GetUserStatisticsQuery)
export class GetUserStatisticsQueryHandler
  implements IQueryHandler<GetUserStatisticsQuery, UserStatisticsResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(): Promise<UserStatisticsResponseDto> {
    return this.adminService.getUserStatistics();
  }
}
