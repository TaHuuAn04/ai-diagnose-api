import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { IWorkingTimeRepository } from "@api/core/repository/working-time.repository.interface";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { WorkingTimeEntity } from "@app/core/domain/entities";

import { WorkingTime } from "../entities";

import { GenericRepository } from "./generic-repository";


@Injectable()
export class WorkingTimeRepository
  extends GenericRepository<WorkingTime, WorkingTimeEntity>(WorkingTime)
  implements IWorkingTimeRepository
{
  constructor(
    @InjectRepository(WorkingTime)
    public readonly repository: Repository<WorkingTime>,
  ) {
    const toDomainEntity = (typeOrmEntity: WorkingTime): WorkingTimeEntity => {
      return plainToInstance(WorkingTimeEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}