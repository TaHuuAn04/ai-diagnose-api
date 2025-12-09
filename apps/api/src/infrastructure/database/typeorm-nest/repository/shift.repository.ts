import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IShiftRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ShiftEntity } from '@app/core/domain/entities';

import { Shift } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ShiftRepository
  extends GenericRepository<Shift, ShiftEntity>(Shift)
  implements IShiftRepository
{
  constructor(
    @InjectRepository(Shift)
    public readonly repository: Repository<Shift>,
  ) {
    const toDomainEntity = (typeOrmEntity: Shift): ShiftEntity => {
      return plainToInstance(ShiftEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
