import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { AppointmentStatus } from '@app/core/domain/enums';

import { BaseEntity } from '../base.entity';

import { Doctor } from './doctor.entity';
import { Image } from './image.entity';
import { Patient } from './patient.entity';
import { Shift } from './shift.entity';

@Entity()
export class Appointment extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  @Index()
  status: AppointmentStatus;

  @Column('uuid')
  shiftId: string;

  @Column('uuid')
  patientId: string;
  
  @Column('uuid')
  doctorId: string;

  @OneToOne(() => Shift, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'shift_id' }) 
  shift: Shift;

  @OneToMany(() => Image, (image) => image.appointment)
  image: Image[];

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' }) 
  patient: Patient;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' }) 
  doctor: Doctor;
}
