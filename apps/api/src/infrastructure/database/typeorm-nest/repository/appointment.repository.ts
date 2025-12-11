import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IAppointmentRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { AppointmentEntity } from '@app/core/domain/entities';

import { Appointment } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class AppointmentRepository
  extends GenericRepository<AppointmentEntity, Appointment>
  implements IAppointmentRepository
{
  constructor(
    @InjectRepository(Appointment)
    public readonly repository: Repository<Appointment>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Appointment): AppointmentEntity => {
        return plainToInstance(AppointmentEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: AppointmentEntity): Appointment => {
        return plainToInstance(Appointment, domainEntity);
      }
    });
  }
}
