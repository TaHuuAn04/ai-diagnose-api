/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DiseaseEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IDiseaseRepository extends IGenericRepository<DiseaseEntity> {}
