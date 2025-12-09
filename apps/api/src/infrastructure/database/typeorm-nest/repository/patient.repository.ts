import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IPatientRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { PatientEntity } from '@app/core/domain/entities';

import { Patient } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class PatientRepository
  extends GenericRepository<Patient, PatientEntity>(Patient)
  implements IPatientRepository
{
  constructor(
    @InjectRepository(Patient)
    public readonly repository: Repository<Patient>,
  ) {
    const toDomainEntity = (typeOrmEntity: Patient): PatientEntity => {
      return plainToInstance(PatientEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
