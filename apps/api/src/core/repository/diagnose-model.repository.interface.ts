/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DiagnoseModelEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IDiagnoseModelRepository extends IGenericRepository<DiagnoseModelEntity> {}
