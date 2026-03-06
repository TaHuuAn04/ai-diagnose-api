 
import { ConsultationEntity } from '@app/core/domain/entities';

import { GetConsultationHistoryDto } from '../../modules/consultation/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IConsultationRepository extends IGenericRepository<ConsultationEntity> {
  findConsultationHistory(
    patientId: string,
    request: GetConsultationHistoryDto
  ): Promise<{ consultations: ConsultationEntity[]; total: number }>;
}
