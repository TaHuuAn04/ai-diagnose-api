/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ScheduleEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IScheduleRepository extends IGenericRepository<ScheduleEntity> {}
