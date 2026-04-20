import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { GetDoctorPatientsRequestDto, PatientConsultationItemResponseDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class GetPatientConsultationsQuery {
  constructor(
    public readonly doctorId: string,
    public readonly patientId: string,
    public readonly query: GetDoctorPatientsRequestDto, // Reuse DTO for month/year
  ) {}
}

@QueryHandler(GetPatientConsultationsQuery)
export class GetPatientConsultationsQueryHandler
  implements IQueryHandler<GetPatientConsultationsQuery, PatientConsultationItemResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(query: GetPatientConsultationsQuery): Promise<PatientConsultationItemResponseDto[]> {
    return this.adminService.getPatientConsultationsByDoctor(
      query.doctorId,
      query.patientId,
      query.query,
    );
  }
}
