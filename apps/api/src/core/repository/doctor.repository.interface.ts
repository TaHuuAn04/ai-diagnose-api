/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DoctorEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IDoctorRepository extends IGenericRepository<DoctorEntity> {}
