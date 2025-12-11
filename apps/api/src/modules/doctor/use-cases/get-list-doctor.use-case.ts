import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto, PageOptionsDto } from '@app/core/dtos';

import { IDoctorService } from '../doctor.interface';
import { GetListDoctorResponseDto } from '../dtos/response';

export class GetListDoctorQuery implements IQuery {
  constructor(public readonly pageOptionsDto: PageOptionsDto) {}
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
    return await this.doctorService.getListDoctors(query.pageOptionsDto);
  }
}
