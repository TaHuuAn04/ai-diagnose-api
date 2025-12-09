/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ResultDiseaseEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IResultDiseaseRepository extends IGenericRepository<ResultDiseaseEntity> {}
