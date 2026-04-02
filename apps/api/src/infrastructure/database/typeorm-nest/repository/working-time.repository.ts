import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IWorkingTimeRepository } from "@api/core/repository/working-time.repository.interface";
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
}