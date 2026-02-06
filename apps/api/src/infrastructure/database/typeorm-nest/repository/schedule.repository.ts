import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IScheduleRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ScheduleEntity } from '@app/core/domain/entities';

import { GetConsultingRoomDto } from '../../../../modules/appointment/dtos';
import { Schedule } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ScheduleRepository
  extends GenericRepository<ScheduleEntity, Schedule>
  implements IScheduleRepository
{
  constructor(
    @InjectRepository(Schedule)
    public readonly repository: Repository<Schedule>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Schedule): ScheduleEntity => {
        return plainToInstance(ScheduleEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: ScheduleEntity): Schedule => {
        return plainToInstance(Schedule, domainEntity);
      }
    });
  }

  async findRoomByDoctorAndShift( input: GetConsultingRoomDto ): Promise<string | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('schedule')
      .where('schedule.doctor = :doctorId', { doctorId: input.doctorId })
      .andWhere('schedule.date = :date', { date: input.date })
      .andWhere('schedule.from <= :timeStart', { timeStart: input.timeStart })
      .andWhere('schedule.to >= :timeEnd', { timeEnd: input.timeEnd });
    const schedule = await queryBuilder.getOne();
    return schedule ? schedule.room : null;
  }
}
