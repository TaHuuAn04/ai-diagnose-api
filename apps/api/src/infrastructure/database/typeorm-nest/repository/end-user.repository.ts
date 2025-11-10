import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IEndUserRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { EndUserEntity } from '@app/core/domain/entities';

import { EndUser } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class EndUserRepository
  extends GenericRepository<EndUser, EndUserEntity>(EndUser)
  implements IEndUserRepository
{
  constructor(
    @InjectRepository(EndUser)
    public readonly repository: Repository<EndUser>,
  ) {
    const toDomEndUsernEntity = (typeOrmEntity: EndUser): EndUserEntity => {
      return plainToInstance(EndUserEntity, typeOrmEntity);
    };

    super(repository, toDomEndUsernEntity);
  }
}
