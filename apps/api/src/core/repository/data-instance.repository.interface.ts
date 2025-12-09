/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataInstanceEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IDataInstanceRepository extends IGenericRepository<DataInstanceEntity> {}
