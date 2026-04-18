import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { GetStaffInfoResponseDto } from '../dtos';
import { IStaffService } from '../interfaces';

export class GetStaffInfoQuery  implements IQuery {
  constructor(public readonly staffId: string) {}
}

@QueryHandler(GetStaffInfoQuery)
export class GetStaffInfoQueryHandler
  implements IQueryHandler<GetStaffInfoQuery, GetStaffInfoResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(query: GetStaffInfoQuery): Promise<GetStaffInfoResponseDto> {
    return await this.staffService.getStaffInfo(query.staffId);
  }
}
