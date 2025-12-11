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
  extends GenericRepository<RoomEntity, Room>
  implements IRoomRepository
{
  constructor(
    @InjectRepository(Room)
    public readonly repository: Repository<Room>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Room): RoomEntity => {
        return plainToInstance(RoomEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: RoomEntity): Room => {
        return plainToInstance(Room, domainEntity);
      }
    });
  }
}
