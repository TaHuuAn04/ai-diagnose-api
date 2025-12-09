/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ConsultationEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IConsultationRepository extends IGenericRepository<ConsultationEntity> {}
