import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IChatHistoryRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ChatHistoryEntity } from '@app/core/domain/entities';

import { ChatHistory } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ChatHistoryRepository
  extends GenericRepository<ChatHistory, ChatHistoryEntity>(ChatHistory)
  implements IChatHistoryRepository
{
  constructor(
    @InjectRepository(ChatHistory)
    public readonly repository: Repository<ChatHistory>,
  ) {
    const toDomainEntity = (typeOrmEntity: ChatHistory): ChatHistoryEntity => {
      return plainToInstance(ChatHistoryEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
