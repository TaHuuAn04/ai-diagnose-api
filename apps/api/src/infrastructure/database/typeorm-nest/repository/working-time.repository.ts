import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IWorkingTimeRepository } from "@api/core/repository/working-time.repository.interface";
import { GetTodayAppointmentsRequestDto } from "apps/api/src/modules/staff/dtos";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { ScheduleEntity , WorkingTimeEntity } from "@app/core/domain/entities";
import { WorkingTimeStatus } from "@app/core/domain/enums";

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

  async findAvailableShifts(
    department: string,
    request: GetTodayAppointmentsRequestDto
  ): Promise<WorkingTimeEntity[]> {
    const { currentDate, from } = request;
    const queryBuilder = this.repository
      .createQueryBuilder('workingTime')
      .andWhere('workingTime.date = :date', { date: currentDate })
      .andWhere('workingTime.status = :status', { status: WorkingTimeStatus.AVAILABLE })
      .leftJoinAndSelect('workingTime.doctor', 'doctor')
      .andWhere('doctor.department = :department', { department })
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('workingTime.shift', 'shift')
      .andWhere('shift.from > :from', { from })
      .orderBy('shift.from', 'ASC')
    
    const entities = await queryBuilder.getMany()

    return entities.map(entity => this._mapper.toDomain(entity));
  }

  async deleteManyByObjects(
    objects: WorkingTimeEntity[]
  ): Promise<number> {
    const queryBuilder = this.repository
      .createQueryBuilder('workingTime')
      .delete()
      .where(objects.map(obj => ({
        doctorId: obj.doctorId,
        date: obj.date,
        shiftId: obj.shiftId
      })))
      
    const result = await queryBuilder.execute();
    return result.affected ?? 0;
  }

  async findWorkingTimesByScheduleInfo(
    schedule: ScheduleEntity
  ): Promise<WorkingTimeEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('workingTime')
      .where('workingTime.doctorId = :doctorId', { doctorId: schedule.doctorId })
      .andWhere('workingTime.date = :date', { date: schedule.date })
      .leftJoinAndSelect('workingTime.shift', 'shift')
      .andWhere('shift.from >= :from', { from: schedule.from })
      .andWhere('shift.to <= :to', { to: schedule.to })
    
    const entities = await queryBuilder.getMany();
    return entities.map(entity => this._mapper.toDomain(entity));;
  }
}