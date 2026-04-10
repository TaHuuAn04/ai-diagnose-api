import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto } from '@app/core/dtos';

import {
  DiagnoseModelResponseDto,
  GetListDiagnoseModelsRequestDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class GetListDiagnoseModelsQuery {
  constructor(public readonly query: GetListDiagnoseModelsRequestDto) {}
}

@QueryHandler(GetListDiagnoseModelsQuery)
export class GetListDiagnoseModelsQueryHandler
  implements
    IQueryHandler<
      GetListDiagnoseModelsQuery,
      PageDto<DiagnoseModelResponseDto>
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    queryOption: GetListDiagnoseModelsQuery,
  ): Promise<PageDto<DiagnoseModelResponseDto>> {
    const { query } = queryOption;
    return this.adminService.getListDiagnoseModels(query);
  }
}
