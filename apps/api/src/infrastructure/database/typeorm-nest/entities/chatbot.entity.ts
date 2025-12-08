import { Column, Entity, OneToMany} from 'typeorm';

import { BaseEntity } from '../base.entity';

import { ChatHistory } from './chatHistory.entity';

@Entity()
export class Chatbot extends BaseEntity {
  @Column({ type: 'varchar', length: 10 })
  version: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ type: 'varchar', length: 255, unique: true })
  accessToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  knowledgeName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  knowledgeUrl: string;

  @Column({ type: 'jsonb' })
  model_config: unknown;

  @OneToMany(() => ChatHistory, (history) => history.chatbot)
  history: ChatHistory[];
}
