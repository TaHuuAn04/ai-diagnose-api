import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IChatbotQueryRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ChatbotQueryEntity } from '@app/core/domain/entities';

import { ChatbotQuery } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ChatbotQueryRepository
  extends GenericRepository<ChatbotQuery, ChatbotQueryEntity>(ChatbotQuery)
  implements IChatbotQueryRepository
{
  constructor(
    @InjectRepository(ChatbotQuery)
    public readonly repository: Repository<ChatbotQuery>,
  ) {
    const toDomainEntity = (typeOrmEntity: ChatbotQuery): ChatbotQueryEntity => {
      return plainToInstance(ChatbotQueryEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
