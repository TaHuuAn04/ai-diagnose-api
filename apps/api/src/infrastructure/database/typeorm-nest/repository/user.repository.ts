import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { UserEntity } from '@app/core/domain/entities';
import { UserRole } from '@app/core/domain/enums';

import { User } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class UserRepository
  extends GenericRepository<UserEntity, User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    public readonly repository: Repository<User>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: User): UserEntity => {
        return plainToInstance(UserEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: UserEntity): User => {
        return plainToInstance(User, domainEntity);
      }
    });
  }

  async getRoleDistribution(): Promise<{ role: string; count: number }[]> {
    const roles = Object.values(UserRole);
    const result = await this.repository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(user.id)', 'count')
      .where('user.role IN (:...roles)', { roles })
      .groupBy('user.role')
      .getRawMany();

    return result.map(item => ({
      role: item.role,
      count: parseInt(item.count, 10)
    }));
  }
}
