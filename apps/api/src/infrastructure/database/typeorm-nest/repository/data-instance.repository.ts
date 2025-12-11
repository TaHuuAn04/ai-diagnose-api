import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IDataInstanceRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { DataInstanceEntity } from '@app/core/domain/entities';

import { DataInstance } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DataInstanceRepository
  extends GenericRepository<DataInstanceEntity, DataInstance>
  implements IDataInstanceRepository
{
  constructor(
    @InjectRepository(DataInstance)
    public readonly repository: Repository<DataInstance>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: DataInstance): DataInstanceEntity => {
        return plainToInstance(DataInstanceEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: DataInstanceEntity): DataInstance => {
        return plainToInstance(DataInstance, domainEntity);
      }
    });
  }
}
