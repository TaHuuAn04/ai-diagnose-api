import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IDoctorRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { DoctorEntity } from '@app/core/domain/entities';
import { AppointmentStatus, SortDirection } from '@app/core/domain/enums';
import { PaginatedResult } from '@app/core/dtos';

import { GetListDoctorRequestDto } from '../../../../modules/doctor/dtos';
import { Doctor } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class DoctorRepository
  extends GenericRepository<DoctorEntity, Doctor>
  implements IDoctorRepository
{
  constructor(
    @InjectRepository(Doctor)
    public readonly repository: Repository<Doctor>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Doctor): DoctorEntity => {
        return plainToInstance(DoctorEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: DoctorEntity): Doctor => {
        return plainToInstance(Doctor, domainEntity);
      }
    });
  }

  async findListDoctors(
    request: GetListDoctorRequestDto
  ): Promise<PaginatedResult<DoctorEntity>> {
    const queryBuilder = this.repository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')

    if (request.shiftId) {
      queryBuilder
        .leftJoinAndSelect('doctor.workingTime', 'workingTime')
        .leftJoinAndSelect('workingTime.shift', 'shift')
        .andWhere('shift.id = :shiftId', { shiftId: request.shiftId });
    } 

    if (request.department) {
      queryBuilder.andWhere('doctor.department = :department', { department: request.department });
    }

    const sortField = request.sort ?? 'user.firstName';
    const sortOrder = request.sortDirection ?? SortDirection.ASC;
    queryBuilder.orderBy(sortField, sortOrder as 'ASC' | 'DESC');

    if (request.keyword) {
      queryBuilder.andWhere(
        `CONCAT(user.firstName, ' ', user.lastName) ILIKE :keyword`,
        { keyword: `%${request.keyword}%` },
      );
    }

    if (request.skip) {
      queryBuilder.skip(request.skip);
    }
    if (request.take) {
      queryBuilder.take(request.take);
    }

    const [ entities, total] = await queryBuilder.getManyAndCount();
    
    const result = entities.map((entity) => this._mapper.toDomain(entity));

    return plainToInstance(PaginatedResult<DoctorEntity>, {
      data: result,
      total,
    });
  }    

  async findActiveDoctors(
    department: string,
    date: string
  ): Promise<DoctorEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('doctor')
      .andWhere('doctor.department = :department', { department })
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('doctor.workingTime', 'workingTime', 'workingTime.date = :date', { date })
      .leftJoinAndSelect('workingTime.appointment', 'appointment', 'appointment.status NOT IN (:...status)', { status: [AppointmentStatus.EXAMINED, AppointmentStatus.CANCELLED] })

    const doctors = await queryBuilder.getMany();
    
    const result = doctors.map((doctor) => this._mapper.toDomain(doctor));

    return plainToInstance(DoctorEntity, result);
  }
}
