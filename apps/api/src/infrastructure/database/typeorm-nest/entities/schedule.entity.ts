import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';

import { AdmissionStaff } from './admissionStaff.entity';
import { Doctor } from './doctor.entity';

@Entity()
export class Schedule extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  doctorId?: string | null;

  @Column('uuid')
  admissionStaffId: string;

  @Column({ type: 'date'})
  date: string;

  @Column({ type: 'timetz' })
  from: string;

  @Column({ type: 'timetz' })
  to: string;

  @Column({ type: 'varchar', length: 255 })
  room: string;

  @ManyToOne(() => AdmissionStaff )
  @JoinColumn({ name: 'admission_staff_id' })
  uploadBy: AdmissionStaff;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;
}
