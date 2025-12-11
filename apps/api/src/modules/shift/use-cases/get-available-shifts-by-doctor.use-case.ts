import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto, PageOptionsDto } from '@app/core/dtos';

import { AvailableShiftResponseDto } from '../dtos/response/available-shift.response.dto';
import { IShiftService } from '../interfaces';

export class GetAvailableShiftsByDoctorQuery {
  constructor(
    public readonly doctorId: string,
    public readonly startDate?: string,
    public readonly endDate?: string,
    public readonly pageOptionsDto?: PageOptionsDto
  ) {}
}

@QueryHandler(GetAvailableShiftsByDoctorQuery)
export class GetAvailableShiftsByDoctorQueryHandler
  implements IQueryHandler<GetAvailableShiftsByDoctorQuery, PageDto<AvailableShiftResponseDto>>
{
  constructor(
    @Inject(INJECTION_TOKEN.SHIFT_SERVICE)
    private readonly shiftService: IShiftService
  ) {}

  async execute(query: GetAvailableShiftsByDoctorQuery): Promise<PageDto<AvailableShiftResponseDto>> {
    return await this.shiftService.getAvailableShiftsByDoctor(
      query.doctorId,
      query.startDate,
      query.endDate,
      query.pageOptionsDto
    );
  }
}
