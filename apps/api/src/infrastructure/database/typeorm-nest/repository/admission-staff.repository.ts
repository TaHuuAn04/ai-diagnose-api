import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IAdmissionStaffRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { AdmissionStaffEntity } from '@app/core/domain/entities';

import { AdmissionStaff } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class AdmissionStaffRepository
  extends GenericRepository<AdmissionStaffEntity, AdmissionStaff>
  implements IAdmissionStaffRepository
{
  constructor(
    @InjectRepository(AdmissionStaff)
    public readonly repository: Repository<AdmissionStaff>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: AdmissionStaff): AdmissionStaffEntity => {
        return plainToInstance(AdmissionStaffEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: AdmissionStaffEntity): AdmissionStaff => {
        return plainToInstance(AdmissionStaff, domainEntity);
      }
    });
  }
}
