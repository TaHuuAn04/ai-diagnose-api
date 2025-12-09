/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ChatHistoryEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IChatHistoryRepository extends IGenericRepository<ChatHistoryEntity> {}
