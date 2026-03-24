import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

import { WorkingTimeStatus } from '@app/core/domain/enums';

import { BaseEntityWithoutId } from '../base.entity';

import { Appointment } from './appointment.entity';
import { Doctor } from './doctor.entity';
import { Shift } from './shift.entity';

@Entity()
export class WorkingTime extends BaseEntityWithoutId {
  @PrimaryColumn('uuid')
  doctorId: string;

  @Column('uuid', { nullable: true })
  appointmentId?: string | null;

  @PrimaryColumn('uuid')
  shiftId: string;

  @Column({ type: 'enum', enum: WorkingTimeStatus, default: WorkingTimeStatus.AVAILABLE })
  status: WorkingTimeStatus;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @OneToOne(() => Appointment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment | null;

  @ManyToOne(() => Shift, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @PrimaryColumn({ type: 'date'})
  date: string;
}