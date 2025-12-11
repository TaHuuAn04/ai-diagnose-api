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
  extends GenericRepository<ShiftEntity, Shift>
  implements IShiftRepository
{
  constructor(
    @InjectRepository(Shift)
    public readonly repository: Repository<Shift>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Shift): ShiftEntity => {
        return plainToInstance(ShiftEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: ShiftEntity): Shift => {
        return plainToInstance(Shift, domainEntity);
      }
    });
  }
}
