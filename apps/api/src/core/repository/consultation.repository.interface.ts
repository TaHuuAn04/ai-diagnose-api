 
import { ConsultationEntity } from '@app/core/domain/entities';
import { PaginatedResult } from '@app/core/dtos';

import { GetConsultationHistoryDto } from '../../modules/consultation/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IConsultationRepository extends IGenericRepository<ConsultationEntity> {
  findConsultationHistory(
    patientId: string,
    request: GetConsultationHistoryDto
  ): Promise<PaginatedResult<ConsultationEntity>>;

  findLatestConsultationsByPatientIds(
    patientIds: string[]
  ): Promise<ConsultationEntity[]>;
}
