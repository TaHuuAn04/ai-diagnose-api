import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { Appointment } from './appointment.entity';
import { Consultation } from './consultation.entity';
import { User } from './user.entity';

@Entity()
export class Doctor {
  @PrimaryColumn('uuid')
  userId: string; 

  @Column({ type: 'varchar', length: 25, unique: true })
  doctorCode: string;

  @Column({ type: 'varchar', length: 25 })
  department: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  experience: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
    
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointment: Appointment[];

  @OneToMany(() => Consultation, (consultation) => consultation.doctor)
  consultation: Consultation[];
}
