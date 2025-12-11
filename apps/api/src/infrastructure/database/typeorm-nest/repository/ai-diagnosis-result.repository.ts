import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IAIDiagnosisResultRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { AIDiagnosisResultEntity } from '@app/core/domain/entities';

import { AIDiagnosisResult } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class AIDiagnosisResultRepository
  extends GenericRepository<AIDiagnosisResultEntity, AIDiagnosisResult>
  implements IAIDiagnosisResultRepository
{
  constructor(
    @InjectRepository(AIDiagnosisResult)
    public readonly repository: Repository<AIDiagnosisResult>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: AIDiagnosisResult): AIDiagnosisResultEntity => {
        return plainToInstance(AIDiagnosisResultEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: AIDiagnosisResultEntity): AIDiagnosisResult => {
        return plainToInstance(AIDiagnosisResult, domainEntity);
      }
    });
  }
}
