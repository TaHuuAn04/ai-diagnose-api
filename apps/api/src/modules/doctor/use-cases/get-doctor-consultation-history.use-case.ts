import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { PageDto } from '@app/core/dtos';

import { IDoctorService } from '../doctor.interface';
import { GetDoctorConsultationHistoryRequestDto, GetDoctorConsultationHistoryResponseDto } from '../dtos';

export class GetDoctorConsultationHistoryQuery implements IQuery {
  constructor(
    public readonly doctorId: string,
    public readonly request: GetDoctorConsultationHistoryRequestDto
  ) { }
}

@QueryHandler(GetDoctorConsultationHistoryQuery)
export class GetDoctorConsultationHistoryQueryHandler
  implements IQueryHandler<GetDoctorConsultationHistoryQuery, PageDto<GetDoctorConsultationHistoryResponseDto>>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService
  ) {}

  async execute(query: GetDoctorConsultationHistoryQuery): Promise<PageDto<GetDoctorConsultationHistoryResponseDto>> {
    return this.doctorService.getConsultationHistory(
      query.doctorId,
      query.request
    );
  }
}
