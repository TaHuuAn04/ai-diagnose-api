 
import { ConsultationEntity } from '@app/core/domain/entities';
import { PaginatedResult } from '@app/core/dtos';

import { GetConsultationHistoryDto, GetMonthlyDiseasesRequestDto } from '../../modules/consultation/dtos';
import { GetDoctorConsultationHistoryRequestDto } from '../../modules/doctor/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IConsultationRepository extends IGenericRepository<ConsultationEntity> {
  findConsultationHistory(
    patientId: string,
    request: GetConsultationHistoryDto
  ): Promise<PaginatedResult<ConsultationEntity>>;

  findLatestConsultationsByPatientIds(
    patientIds: string[]
  ): Promise<ConsultationEntity[]>;

  findConsultationWithDepartmentRelated(
    department: string,
    request: GetMonthlyDiseasesRequestDto
  ): Promise<ConsultationEntity[]>;

  findDoctorConsultationHistory(
    doctorId: string,
    request: GetDoctorConsultationHistoryRequestDto
  ): Promise<PaginatedResult<ConsultationEntity>>;

  findConsultationDetailById(
    consultationId: string, 
    doctorId: string
  ): Promise<ConsultationEntity | null>;

  findAllByPatientId(
    patientId: string, 
    excludeConsultationId?: string
  ): Promise<ConsultationEntity[]>;
}
