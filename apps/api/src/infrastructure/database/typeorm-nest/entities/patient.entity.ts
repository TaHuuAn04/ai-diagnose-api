import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { BaseEntityWithoutId } from '../base.entity';

import { Appointment } from './appointment.entity';
import { ChatHistory } from './chatHistory.entity';
import { Consultation } from './consultation.entity';
import { User } from './user.entity';

@Entity()
export class Patient extends BaseEntityWithoutId {
  @PrimaryColumn('uuid')
  userId: string; 

  @Column({ type: 'varchar', length: 25, nullable: true })
  folk: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  citizenCode: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  medicalInsurance: string;
    
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @OneToMany(() => ChatHistory, (history) => history.patient)
  history: ChatHistory[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointment: Appointment[];
  
  @OneToMany(() => Consultation, (consultation) => consultation.patient)
  consultation: Consultation[];
}
