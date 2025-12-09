import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IDoctorRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { DoctorEntity } from '@app/core/domain/entities';

import { Doctor } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DoctorRepository
  extends GenericRepository<Doctor, DoctorEntity>(Doctor)
  implements IDoctorRepository
{
  constructor(
    @InjectRepository(Doctor)
    public readonly repository: Repository<Doctor>,
  ) {
    const toDomainEntity = (typeOrmEntity: Doctor): DoctorEntity => {
      return plainToInstance(DoctorEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
