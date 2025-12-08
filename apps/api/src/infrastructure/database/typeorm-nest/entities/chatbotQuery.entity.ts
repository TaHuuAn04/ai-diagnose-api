import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";

import { BaseEntity } from "../base.entity";

import { ChatHistory } from "./chatHistory.entity";

@Entity()
export class ChatbotQuery extends BaseEntity {
  @Column('uuid')
  parentId: string

  @Column('uuid')
  historyId: string
  
  @Column({ type: 'varchar', length: 255 })
  query: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  response: string

  @OneToOne(() => ChatbotQuery, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: ChatbotQuery

  @ManyToOne(() => ChatHistory )
  @JoinColumn({ name: 'history_id' }) 
  history: ChatHistory;
}