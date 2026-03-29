import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { AppointmentMetadata } from '@app/core/domain/entities';
import { AppointmentStatus } from '@app/core/domain/enums';

import { BaseEntity } from '../base.entity';

import { Consultation } from './consultation.entity';
import { Patient } from './patient.entity';
import { WorkingTime } from './workingTime.entity';

@Entity()
export class Appointment extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
  @Index()
  status: AppointmentStatus;

  @Column('uuid')
  patientId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: AppointmentMetadata | null;

  @OneToOne(() => WorkingTime, (workingTime) => workingTime.appointment)
  workingTime?: WorkingTime | null; 

  @OneToOne(() => Consultation, (consultation) => consultation.appointment)
  consultation?: Consultation | null;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' }) 
  patient?: Patient | null;

  @Column({ type: 'text', nullable: true })
  note?: string | null;
}
