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
  extends GenericRepository<PatientEntity, Patient>
  implements IPatientRepository
{
  constructor(
    @InjectRepository(Patient)
    public readonly repository: Repository<Patient>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Patient): PatientEntity => {
        return plainToInstance(PatientEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: PatientEntity): Patient => {
        return plainToInstance(Patient, domainEntity);
      }
    });
  }
}
