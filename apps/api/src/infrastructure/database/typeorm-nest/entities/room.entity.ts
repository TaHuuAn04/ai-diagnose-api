import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from '../base.entity';

import { Doctor } from './doctor.entity';
import { Schedule } from './schedule.entity';

@Entity()
export class Room extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  room: string;

  @PrimaryColumn('uuid')
  doctorId: string;
    
  @PrimaryColumn('uuid')
  scheduleId: string;

  @OneToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' }) 
  doctor: Doctor;

  @OneToOne(() => Schedule, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}
