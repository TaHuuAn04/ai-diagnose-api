import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IScheduleRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ScheduleEntity } from '@app/core/domain/entities';

import { Schedule } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ScheduleRepository
  extends GenericRepository<Schedule, ScheduleEntity>(Schedule)
  implements IScheduleRepository
{
  constructor(
    @InjectRepository(Schedule)
    public readonly repository: Repository<Schedule>,
  ) {
    const toDomainEntity = (typeOrmEntity: Schedule): ScheduleEntity => {
      return plainToInstance(ScheduleEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
