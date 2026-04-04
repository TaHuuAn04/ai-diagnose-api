import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IStaffService } from '../interfaces'
import { GetScheduleRequestDto, GetScheduleResponseDto } from '../dtos';

export class GetScheduleQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly request: GetScheduleRequestDto
  ) { }
}

@QueryHandler(GetScheduleQuery)
export class GetScheduleQueryHandler
  implements IQueryHandler<GetScheduleQuery, GetScheduleResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(query: GetScheduleQuery): Promise<GetScheduleResponseDto[]> {
    const result = await this.staffService.getScheduleInfo(
      query.userId,
      query.request
    );

    return result;
  }
}
