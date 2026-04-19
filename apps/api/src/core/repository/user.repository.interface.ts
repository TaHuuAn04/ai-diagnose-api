/* eslint-disable @typescript-eslint/no-empty-object-type */
import { UserEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IUserRepository extends IGenericRepository<UserEntity> {
  getRoleDistribution(): Promise<{ role: string; count: number }[]>;
}
