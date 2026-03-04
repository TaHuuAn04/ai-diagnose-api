import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IDoctorService } from '../doctor.interface';
import { GetDoctorResponseDto } from '../dtos';

export class GetDoctorInfoQuery  implements IQuery {
  constructor(public readonly doctorId: string) {}
}

@QueryHandler(GetDoctorInfoQuery)
export class GetDoctorInfoQueryHandler
  implements IQueryHandler<GetDoctorInfoQuery, GetDoctorResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService
  ) {}

  async execute(query: GetDoctorInfoQuery): Promise<GetDoctorResponseDto> {
    return await this.doctorService.getDoctorInfo(query.doctorId);
  }
}
