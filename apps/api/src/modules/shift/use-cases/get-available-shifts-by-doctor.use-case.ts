import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto} from '@app/core/dtos';

import { GetShiftsByDoctorIdRequestDto } from '../dtos/requests/get-available-shifts.request.dto';
import { AvailableShiftResponseDto } from '../dtos/response/available-shift.response.dto';
import { IShiftService } from '../interfaces';

export class GetShiftsByDoctorQuery {
  constructor(
    public readonly doctorId: string,
    public readonly input: GetShiftsByDoctorIdRequestDto
  ) {}
}

@QueryHandler(GetShiftsByDoctorQuery)
export class GetShiftsByDoctorQueryHandler
  implements IQueryHandler<GetShiftsByDoctorQuery, AvailableShiftResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.SHIFT_SERVICE)
    private readonly shiftService: IShiftService
  ) {}

  async execute(query: GetShiftsByDoctorQuery): Promise<AvailableShiftResponseDto[]> {
    return await this.shiftService.getShiftsByDoctor(
      query.doctorId,
      query.input
    );
  }
}
