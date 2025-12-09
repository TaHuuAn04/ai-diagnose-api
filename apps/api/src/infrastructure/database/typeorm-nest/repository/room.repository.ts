import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IRoomRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { RoomEntity } from '@app/core/domain/entities';

import { Room } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class RoomRepository
  extends GenericRepository<Room, RoomEntity>(Room)
  implements IRoomRepository
{
  constructor(
    @InjectRepository(Room)
    public readonly repository: Repository<Room>,
  ) {
    const toDomainEntity = (typeOrmEntity: Room): RoomEntity => {
      return plainToInstance(RoomEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
