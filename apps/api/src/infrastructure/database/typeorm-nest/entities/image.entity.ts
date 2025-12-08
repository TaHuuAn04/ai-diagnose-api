import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ImageType } from '@app/core/domain/enums';

import { BaseEntity } from '../base.entity';

import { Appointment } from './appointment.entity';
import { Consultation } from './consultation.entity';

@Entity()
export class Image extends BaseEntity {
  @Column('uuid')
  appointmentId: string

  @Column('uuid')
  consultationId: string

  @Column({ type: 'varchar', unique: true})
  data_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string
  
  @Column({ type: 'enum', enum: ImageType, default: ImageType.SYMSTOMS })
  type: string
  
  @ManyToOne(() => Appointment)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => Consultation)
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;
}
