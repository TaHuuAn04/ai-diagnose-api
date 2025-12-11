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
  extends GenericRepository<ConsultationEntity, Consultation>
  implements IConsultationRepository
{
  constructor(
    @InjectRepository(Consultation)
    public readonly repository: Repository<Consultation>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Consultation): ConsultationEntity => {
        return plainToInstance(ConsultationEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: ConsultationEntity): Consultation => {
        return plainToInstance(Consultation, domainEntity);
      }
    });
  }
}
