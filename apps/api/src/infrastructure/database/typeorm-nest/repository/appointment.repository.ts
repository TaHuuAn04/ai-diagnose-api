import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IAppointmentRepository } from 'apps/api/src/core/repository';
import { GetListAppointmentDto } from 'apps/api/src/modules/appointment/dtos';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { AppointmentEntity } from '@app/core/domain/entities';
import { AppointmentStatus, SortDirection } from '@app/core/domain/enums';
import { PaginatedResult } from '@app/core/dtos';

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

  async findListAppointments(
    userId: string,
    request: GetListAppointmentDto
  ): Promise<PaginatedResult<AppointmentEntity>> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.workingTime', 'workingTime')
      .leftJoinAndSelect('workingTime.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('workingTime.shift', 'shift')
    
    if (userId) {
      queryBuilder.andWhere('appointment.patientId = :userId', {
        userId: userId,
      });
    }

    if (request.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: request.status });
    }
      
    if (request.keyword) {
      queryBuilder.andWhere(
        `CONCAT(user.firstName, ' ', user.lastName) ILIKE :keyword`,
        { keyword: `%${request.keyword}%` },
      );
    }

    const sortField = request.sort ?? 'updatedAt';
    const sortOrder = request.sortDirection ?? SortDirection.DESC;
    queryBuilder.orderBy(`appointment.${sortField}`, sortOrder as 'ASC' | 'DESC');

    if (request.skip) {
      queryBuilder.skip(request.skip);
    }
    if (request.take) {
      queryBuilder.take(request.take);
    }

    const [ entities, total ] = await queryBuilder.getManyAndCount();

    const appointments = entities.map(entity => this._mapper.toDomain(entity));

    return plainToInstance(PaginatedResult<AppointmentEntity>, {
      data: appointments,
      total
    });
  }

  async findUpcomingAppointment(
    userId: string
  ): Promise<AppointmentEntity | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.workingTime', 'workingTime')
      .leftJoinAndSelect('workingTime.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('workingTime.shift', 'shift')
      .where('appointment.patientId = :userId', { userId: userId })
      .andWhere('appointment.status NOT IN (:...statuses)', { statuses: [AppointmentStatus.EXAMINED, AppointmentStatus.CANCELLED] })
      .andWhere('shift.date + shift.to >= :date', { date: new Date() })
      .orderBy('shift.date', 'ASC').addOrderBy('shift.from', 'ASC')

    const entity = await queryBuilder.getOne();

    return entity ? this._mapper.toDomain(entity) : null;
  }
}
