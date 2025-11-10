import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { UserEntity } from '@app/core/domain/entities';

import { User } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class UserRepository
  extends GenericRepository<User, UserEntity>(User)
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
  ) {
    const toDomainEntity = (typeOrmEntity: User): UserEntity => {
      return plainToInstance(UserEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
