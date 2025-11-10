import { UserEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export type IUserRepository = IGenericRepository<UserEntity>;
