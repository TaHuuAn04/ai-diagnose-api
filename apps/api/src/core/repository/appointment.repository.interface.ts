/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AppointmentEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IAppointmentRepository extends IGenericRepository<AppointmentEntity> {}
