import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IAIResultDiseaseRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { AIResultDiseaseEntity } from '@app/core/domain/entities';

import { AIResultDisease } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class AIResultDiseaseRepository
  extends GenericRepository<AIResultDiseaseEntity, AIResultDisease>
  implements IAIResultDiseaseRepository
{
  constructor(
    @InjectRepository(AIResultDisease)
    public readonly repository: Repository<AIResultDisease>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: AIResultDisease): AIResultDiseaseEntity => {
        return plainToInstance(AIResultDiseaseEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: AIResultDiseaseEntity): AIResultDisease => {
        return plainToInstance(AIResultDisease, domainEntity);
      }
    });
  }
}
