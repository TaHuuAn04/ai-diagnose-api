import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IWorkingTimeRepository } from "@api/core/repository/working-time.repository.interface";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { WorkingTimeEntity } from "@app/core/domain/entities";
import { WorkingTimeStatus } from "@app/core/domain/enums";
import { PageOptionsDto } from "@app/core/dtos";

import { WorkingTime } from "../entities";

import { GenericRepository } from "./generic-repository";


@Injectable()
export class WorkingTimeRepository
  extends GenericRepository<WorkingTimeEntity, WorkingTime>
  implements IWorkingTimeRepository
{
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

  async findAvailableShiftsByDoctor(
    doctorId: string,
    startDate?: string,
    endDate?: string,
    pageOptions?: PageOptionsDto
  ): Promise<WorkingTimeEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('workingTime')
      .leftJoinAndSelect('workingTime.shift', 'shift')
      .where('workingTime.doctorId = :doctorId', { doctorId })
      .andWhere('workingTime.status = :status', { status: WorkingTimeStatus.AVAILABLE });

    if (startDate) {
      queryBuilder.andWhere('shift.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('shift.date <= :endDate', { endDate });
    }

    queryBuilder.orderBy('shift.date', 'ASC').addOrderBy('shift.from', 'ASC');

    if (pageOptions) {
      const skip = (pageOptions.page - 1) * pageOptions.take;
      queryBuilder.skip(skip).take(pageOptions.take);
    }

    const results = await queryBuilder.getMany();
    return results.map((entity) => plainToInstance(WorkingTimeEntity, entity));
  }

  async countAvailableShiftsByDoctor(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<number> {
    const queryBuilder = this.repository
      .createQueryBuilder('workingTime')
      .leftJoin('workingTime.shift', 'shift')
      .where('workingTime.doctorId = :doctorId', { doctorId })
      .andWhere('workingTime.status = :status', { status: WorkingTimeStatus.AVAILABLE });

    if (startDate) {
      queryBuilder.andWhere('shift.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('shift.date <= :endDate', { endDate });
    }

    return await queryBuilder.getCount();
  }
}