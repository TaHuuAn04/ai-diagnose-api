import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IDiseaseRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { DiseaseEntity } from '@app/core/domain/entities';

import { Disease } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DiseaseRepository
  extends GenericRepository<DiseaseEntity, Disease>
  implements IDiseaseRepository
{
  constructor(
    @InjectRepository(Disease)
    public readonly repository: Repository<Disease>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Disease): DiseaseEntity => {
        return plainToInstance(DiseaseEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: DiseaseEntity): Disease => {
        return plainToInstance(Disease, domainEntity);
      }
    });
  }
}
