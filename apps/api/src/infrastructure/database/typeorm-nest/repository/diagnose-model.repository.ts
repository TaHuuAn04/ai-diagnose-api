import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IDiagnoseModelRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { DiagnoseModelEntity } from '@app/core/domain/entities';

import { DiagnoseModel } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DiagnoseModelRepository
  extends GenericRepository<DiagnoseModel, DiagnoseModelEntity>(DiagnoseModel)
  implements IDiagnoseModelRepository
{
  constructor(
    @InjectRepository(DiagnoseModel)
    public readonly repository: Repository<DiagnoseModel>,
  ) {
    const toDomainEntity = (typeOrmEntity: DiagnoseModel): DiagnoseModelEntity => {
      return plainToInstance(DiagnoseModelEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
