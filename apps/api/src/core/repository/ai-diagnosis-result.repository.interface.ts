/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AIDiagnosisResultEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IAIDiagnosisResultRepository extends IGenericRepository<AIDiagnosisResultEntity> {}
