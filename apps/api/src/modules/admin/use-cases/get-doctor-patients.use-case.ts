import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { DoctorPatientItemResponseDto, GetDoctorPatientsRequestDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class GetDoctorPatientsQuery {
  constructor(
    public readonly doctorId: string,
    public readonly query: GetDoctorPatientsRequestDto,
  ) {}
}

@QueryHandler(GetDoctorPatientsQuery)
export class GetDoctorPatientsQueryHandler
  implements IQueryHandler<GetDoctorPatientsQuery, DoctorPatientItemResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(query: GetDoctorPatientsQuery): Promise<DoctorPatientItemResponseDto[]> {
    return this.adminService.getDoctorPatients(query.doctorId, query.query);
  }
}
