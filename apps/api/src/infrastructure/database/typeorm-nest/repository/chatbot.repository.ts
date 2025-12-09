import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IChatbotRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ChatbotEntity } from '@app/core/domain/entities';

import { Chatbot } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ChatbotRepository
  extends GenericRepository<Chatbot, ChatbotEntity>(Chatbot)
  implements IChatbotRepository
{
  constructor(
    @InjectRepository(Chatbot)
    public readonly repository: Repository<Chatbot>,
  ) {
    const toDomainEntity = (typeOrmEntity: Chatbot): ChatbotEntity => {
      return plainToInstance(ChatbotEntity, typeOrmEntity);
    };

    super(repository, toDomainEntity);
  }
}
