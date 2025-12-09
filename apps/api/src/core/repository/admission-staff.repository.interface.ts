/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AdmissionStaffEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IAdmissionStaffRepository extends IGenericRepository<AdmissionStaffEntity> {}
