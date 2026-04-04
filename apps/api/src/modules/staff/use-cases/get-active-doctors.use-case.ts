import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IStaffService } from '../interfaces'
import { GetActiveDoctorsResponseDto } from '../dtos';

export class GetActiveDoctorsQuery implements IQuery {
  constructor(
    public readonly staffId: string,
    public readonly date: string
  ) { }
}

@QueryHandler(GetActiveDoctorsQuery)
export class GetActiveDoctorsQueryHandler
  implements IQueryHandler<GetActiveDoctorsQuery, GetActiveDoctorsResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(query: GetActiveDoctorsQuery): Promise<GetActiveDoctorsResponseDto[]> {
    const result = await this.staffService.getActiveDoctors(
      query.staffId,
      query.date
    );

    return result;
  }
}
