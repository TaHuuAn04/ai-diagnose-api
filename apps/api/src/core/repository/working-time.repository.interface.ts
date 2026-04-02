import { WorkingTimeEntity } from '@app/core/domain/entities/working-time';

import { IGenericRepository } from './generic-repository.interface';

export interface IWorkingTimeRepository extends IGenericRepository<WorkingTimeEntity> {}