import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto } from '@app/core/dtos';

import { GetListAppointmentsRequestDto, GetListAppointmentsResponseDto } from '../dtos';
import { IStaffService } from '../interfaces'

export class GetListAppointmentsQuery implements IQuery {
  constructor(
    public readonly request: GetListAppointmentsRequestDto
  ) { }
}

@QueryHandler(GetListAppointmentsQuery)
export class GetListAppointmentsQueryHandler
  implements IQueryHandler<GetListAppointmentsQuery, PageDto<GetListAppointmentsResponseDto>>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(query: GetListAppointmentsQuery): Promise<PageDto<GetListAppointmentsResponseDto>> {
    const result = await this.staffService.getListAppointments(
      query.request
    );

    return result;
  }
}
