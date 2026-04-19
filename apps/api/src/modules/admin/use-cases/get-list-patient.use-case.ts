import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto } from '@app/core/dtos';

import { GetListPatientRequestDto, GetPatientResponseDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class GetListPatientQuery {
  constructor(public readonly query: GetListPatientRequestDto) {}
}

@QueryHandler(GetListPatientQuery)
export class GetListPatientQueryHandler
  implements IQueryHandler<GetListPatientQuery, PageDto<GetPatientResponseDto>>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(query: GetListPatientQuery): Promise<PageDto<GetPatientResponseDto>> {
    return this.adminService.getListPatients(query.query);
  }
}
