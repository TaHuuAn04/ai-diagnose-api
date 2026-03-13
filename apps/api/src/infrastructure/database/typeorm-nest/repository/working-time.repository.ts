import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IWorkingTimeRepository } from "@api/core/repository/working-time.repository.interface";
import { GetPersonalAppointmentsRequestDto } from "apps/api/src/modules/doctor/dtos";
import { GetShiftsByDoctorIdRequestDto } from "apps/api/src/modules/shift/dtos/requests/get-available-shifts.request.dto";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { WorkingTimeEntity } from "@app/core/domain/entities";
import { SortDirection } from "@app/core/domain/enums";
import { PaginatedResult } from "@app/core/dtos";

import { WorkingTime } from "../entities";

import { GenericRepository } from "./generic-repository";


@Injectable()
export class WorkingTimeRepository
  extends GenericRepository<WorkingTimeEntity, WorkingTime>
  implements IWorkingTimeRepository {
  constructor(
    @InjectRepository(WorkingTime)
    public readonly repository: Repository<WorkingTime>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: WorkingTime): WorkingTimeEntity => {
        return plainToInstance(WorkingTimeEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: WorkingTimeEntity): WorkingTime => {
        return plainToInstance(WorkingTime, domainEntity);
      }
    });
  }

  async findShiftsByDoctor(
    doctorId: string,
    input: GetShiftsByDoctorIdRequestDto
  ): Promise<WorkingTimeEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('workingTime')
      .leftJoinAndSelect('workingTime.shift', 'shift')
      .where('workingTime.doctorId = :doctorId', { doctorId })

    if (input.startDate) {
      queryBuilder.andWhere('shift.date >= :startDate', { startDate: input.startDate });
    }

    if (input.endDate) {
      queryBuilder.andWhere('shift.date <= :endDate', { endDate: input.endDate });
    }

    if (input.status) {
      queryBuilder.andWhere('workingTime.status = :status', { status: input.status });
    }

    const sortField = input.sort ? `shift.${input.sort}` : 'shift.date';
    const sortDirection = input.sortDirection ?? SortDirection.ASC;
    queryBuilder.orderBy(sortField, sortDirection)
      .addOrderBy('shift.from', 'ASC');

    if (input.sort && input.sortDirection) {
      queryBuilder.orderBy(`shift.${input.sort}`, input.sortDirection)
        .addOrderBy('shift.from', 'ASC');
    }

    if (input.take && input.page) {
      const skip = (input.page - 1) * input.take;
      queryBuilder.skip(skip).take(input.take);
    }

    const results = await queryBuilder.getMany();
    return results.map((entity) => plainToInstance(WorkingTimeEntity, entity));
  }

  async countShiftsByDoctor(
    doctorId: string,
    input: GetShiftsByDoctorIdRequestDto
  ): Promise<number> {
    const queryBuilder = this.repository
      .createQueryBuilder('workingTime')
      .leftJoin('workingTime.shift', 'shift')
      .where('workingTime.doctorId = :doctorId', { doctorId })

    if (input.startDate) {
      queryBuilder.andWhere('shift.date >= :startDate', { startDate: input.startDate });
    }

    if (input.endDate) {
      queryBuilder.andWhere('shift.date <= :endDate', { endDate: input.endDate });
    }

    if (input.status) {
      queryBuilder.andWhere('workingTime.status = :status', { status: input.status });
    }

    return await queryBuilder.getCount();
  }

  async findDoctorAppointments(
    doctorId: string,
    input: GetPersonalAppointmentsRequestDto
  ): Promise<PaginatedResult<WorkingTimeEntity>> {
    const queryBuilder = this.repository
      .createQueryBuilder('workingTime')
      .where('workingTime.doctorId = :doctorId', { doctorId })
      .andWhere('workingTime.appointmentId IS NOT NULL')
      .leftJoinAndSelect('workingTime.shift', 'shift')
      .leftJoinAndSelect('workingTime.appointment', 'appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')
      .andWhere('shift.date >= :startDate', { startDate: input.startDate })
      .andWhere('shift.date <= :endDate', { endDate: input.endDate });
    
    if (input.from) {
      queryBuilder.andWhere('shift.from >= :from', { from: input.from });
    }

    if (input.to) {
      queryBuilder.andWhere('shift.to <= :to', { to: input.to });
    }

    if (input.keyword) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :keyword OR user.lastName ILIKE :keyword OR user.phoneNumber ILIKE :keyword)',
        { keyword: `%${input.keyword}%` }
      );
    }

    if (input.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: input.status });
    }

    const sortField = input.sort ?? 'updatedAt';
    const sortOrder = input.sortDirection ?? SortDirection.DESC;
    queryBuilder.orderBy(`shift.${sortField}`, sortOrder as 'ASC' | 'DESC');

    if (input.skip) {
      queryBuilder.skip(input.skip);
    }
    if (input.take) {
      queryBuilder.take(input.take);
    }

    const [ entities, total ] = await queryBuilder.getManyAndCount();
    const workingTimes = entities.map((entity) => this._mapper.toDomain(entity));

    return plainToInstance(PaginatedResult<WorkingTimeEntity>, {
      data: workingTimes,
      total
    });
  } 
}