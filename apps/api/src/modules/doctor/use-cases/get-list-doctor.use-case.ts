import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto } from '@app/core/dtos';

import { IDoctorService } from '../doctor.interface';
import { GetListDoctorRequestDto, GetListDoctorResponseDto } from '../dtos';

export class GetListDoctorQuery implements IQuery {
  constructor(public readonly request: GetListDoctorRequestDto) {}
}

@QueryHandler(GetListDoctorQuery)
export class GetListDoctorQueryHandler
  implements IQueryHandler<GetListDoctorQuery, PageDto<GetListDoctorResponseDto>>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService
  ) {}

  async execute(query: GetListDoctorQuery): Promise<PageDto<GetListDoctorResponseDto>> {
    return await this.doctorService.getListDoctors(query.request);
  }
}
