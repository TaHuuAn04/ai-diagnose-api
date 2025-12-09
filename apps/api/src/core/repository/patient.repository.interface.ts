/* eslint-disable @typescript-eslint/no-empty-object-type */
import { PatientEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IPatientRepository extends IGenericRepository<PatientEntity> {}
