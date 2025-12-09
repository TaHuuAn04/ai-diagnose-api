/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ChatbotQueryEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';

export interface IChatbotQueryRepository extends IGenericRepository<ChatbotQueryEntity> {}
