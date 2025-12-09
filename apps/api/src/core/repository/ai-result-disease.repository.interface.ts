/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AIResultDiseaseEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IAIResultDiseaseRepository extends IGenericRepository<AIResultDiseaseEntity> {}
