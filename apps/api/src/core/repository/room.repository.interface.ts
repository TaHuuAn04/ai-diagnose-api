/* eslint-disable @typescript-eslint/no-empty-object-type */
import { RoomEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IRoomRepository extends IGenericRepository<RoomEntity> {}
