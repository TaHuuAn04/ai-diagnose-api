import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IDiagnosisResultRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { DiagnosisResultEntity } from '@app/core/domain/entities';

import { DiagnosisResult } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DiagnosisResultRepository
  extends GenericRepository<DiagnosisResultEntity, DiagnosisResult>
  implements IDiagnosisResultRepository
{
  constructor(
    @InjectRepository(DiagnosisResult)
    public readonly repository: Repository<DiagnosisResult>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: DiagnosisResult): DiagnosisResultEntity => {
        return plainToInstance(DiagnosisResultEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: DiagnosisResultEntity): DiagnosisResult => {
        return plainToInstance(DiagnosisResult, domainEntity);
      }
    });
  }
}
