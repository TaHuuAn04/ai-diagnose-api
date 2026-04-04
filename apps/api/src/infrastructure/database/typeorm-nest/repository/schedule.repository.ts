import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IScheduleRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ScheduleEntity } from '@app/core/domain/entities';

import { GetConsultingRoomDto } from '../../../../modules/appointment/dtos';
import { Schedule } from '../entities';

import { GenericRepository } from './generic-repository';
import { GetScheduleRequestDto } from 'apps/api/src/modules/staff/dtos';
import { BadRequestException } from '@app/core/exception';

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

  async findSchedulesWithDepartmentForStaff(
    department: string,
    request: GetScheduleRequestDto
  ): Promise<ScheduleEntity[]> {
    const { startDate, endDate } = request;
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const queryBuilder = this.repository.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .where('doctor.department = :department', { department })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('schedule.date', 'ASC')
      .addOrderBy('schedule.from', 'ASC');

    const schedules = await queryBuilder.getMany();
    return schedules.map(schedule => this._mapper.toDomain(schedule));
  }
}
