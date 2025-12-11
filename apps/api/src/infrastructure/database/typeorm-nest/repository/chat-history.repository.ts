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
  extends GenericRepository<ChatHistoryEntity, ChatHistory>
  implements IChatHistoryRepository
{
  constructor(
    @InjectRepository(ChatHistory)
    public readonly repository: Repository<ChatHistory>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: ChatHistory): ChatHistoryEntity => {
        return plainToInstance(ChatHistoryEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: ChatHistoryEntity): ChatHistory => {
        return plainToInstance(ChatHistory, domainEntity);
      }
    });
  }
}
