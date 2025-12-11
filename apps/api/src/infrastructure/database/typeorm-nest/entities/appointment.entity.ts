import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AppointmentStatus } from '@app/core/domain/enums';

import { BaseEntity } from '../base.entity';

import { Image } from './image.entity';
import { Patient } from './patient.entity';
import { WorkingTime } from './workingTime.entity';

@Entity()
export class Appointment extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  @Index()
  status: AppointmentStatus;

  @Column('uuid')
  patientId: string;

  @OneToOne(() => WorkingTime, (workingTime) => workingTime.appointment)
  @JoinColumn({ name: 'working_time_id' })
  workingTime: WorkingTime; 

  @OneToMany(() => Image, (image) => image.appointment)
  image: Image[];

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' }) 
  patient: Patient;
}
