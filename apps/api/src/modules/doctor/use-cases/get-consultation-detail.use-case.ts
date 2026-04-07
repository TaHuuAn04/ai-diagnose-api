import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IDoctorService } from '../doctor.interface';
import { GetConsultationDetailResponseDto } from '../dtos';

export class GetConsultationDetailQuery implements IQuery {
  constructor(
    public readonly doctorId: string,
    public readonly consultationId: string
  ) { }
}

@QueryHandler(GetConsultationDetailQuery)
export class GetConsultationDetailQueryHandler
  implements IQueryHandler<GetConsultationDetailQuery, GetConsultationDetailResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService
  ) {}

  async execute(query: GetConsultationDetailQuery): Promise<GetConsultationDetailResponseDto> {
    return this.doctorService.getConsultationDetail(
      query.doctorId,
      query.consultationId
    );
  }
}
