import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IConsultationRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ConsultationEntity } from '@app/core/domain/entities';

import { Consultation } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ConsultationRepository
  extends GenericRepository<Consultation, ConsultationEntity>(Consultation)
  implements IConsultationRepository
{
  constructor(
    @InjectRepository(Consultation)
    public readonly repository: Repository<Consultation>,
  ) {
    const toDomainEntity = (typeOrmEntity: Consultation): ConsultationEntity => {
      return plainToInstance(ConsultationEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
