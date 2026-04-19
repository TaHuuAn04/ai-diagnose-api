import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto } from '@app/core/dtos';

import { GetListStaffRequestDto, GetStaffResponseDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class GetListStaffQuery {
  constructor(public readonly query: GetListStaffRequestDto) {}
}

@QueryHandler(GetListStaffQuery)
export class GetListStaffQueryHandler
  implements IQueryHandler<GetListStaffQuery, PageDto<GetStaffResponseDto>>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(query: GetListStaffQuery): Promise<PageDto<GetStaffResponseDto>> {
    return this.adminService.getListStaffs(query.query);
  }
}
