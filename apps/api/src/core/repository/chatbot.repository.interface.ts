/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ChatbotEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IChatbotRepository extends IGenericRepository<ChatbotEntity> {}
