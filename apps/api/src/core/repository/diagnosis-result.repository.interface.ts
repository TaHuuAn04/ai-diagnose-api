/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DiagnosisResultEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IDiagnosisResultRepository extends IGenericRepository<DiagnosisResultEntity> {}
