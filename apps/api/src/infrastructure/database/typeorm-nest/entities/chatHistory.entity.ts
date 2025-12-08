import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { BaseEntity } from "../base.entity";

import { Chatbot } from "./chatbot.entity";
import { ChatbotQuery } from "./chatbotQuery.entity";
import { Patient } from "./patient.entity";

@Entity()
export class ChatHistory extends BaseEntity {
  @Column('uuid')
  patientId: string

  @Column('uuid')
  chatbotId: string

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ManyToOne(() => Patient )
  @JoinColumn({ name: 'patient_id'})
  patient: Patient;
  
  @ManyToOne(() => Chatbot )
  @JoinColumn({ name: 'chatbot_id'})
  chatbot: Chatbot;

  @OneToMany(() => ChatbotQuery, (query) => query.history)
  query: ChatbotQuery[];
}