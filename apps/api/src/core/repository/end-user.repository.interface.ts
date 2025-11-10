import { EndUserEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export type IEndUserRepository = IGenericRepository<EndUserEntity>;
