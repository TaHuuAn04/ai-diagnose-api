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
  extends GenericRepository<ChatbotQueryEntity, ChatbotQuery>
  implements IChatbotQueryRepository
{
  constructor(
    @InjectRepository(ChatbotQuery)
    public readonly repository: Repository<ChatbotQuery>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: ChatbotQuery): ChatbotQueryEntity => {
        return plainToInstance(ChatbotQueryEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: ChatbotQueryEntity): ChatbotQuery => {
        return plainToInstance(ChatbotQuery, domainEntity);
      }
    });
  }
}
