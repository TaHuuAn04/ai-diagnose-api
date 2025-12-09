import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IResultDiseaseRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ResultDiseaseEntity } from '@app/core/domain/entities';

import { ResultDisease } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ResultDiseaseRepository
  extends GenericRepository<ResultDisease, ResultDiseaseEntity>(ResultDisease)
  implements IResultDiseaseRepository
{
  constructor(
    @InjectRepository(ResultDisease)
    public readonly repository: Repository<ResultDisease>,
  ) {
    const toDomainEntity = (typeOrmEntity: ResultDisease): ResultDiseaseEntity => {
      return plainToInstance(ResultDiseaseEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
