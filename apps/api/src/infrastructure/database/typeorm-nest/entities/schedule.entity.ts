import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';

import { AdmissionStaff } from './admissionStaff.entity';

@Entity()
export class Schedule extends BaseEntity {
  @Column('uuid')
  admissionStaffId: string;

  @Column({ type: 'date'})
  date: string;

  @Column({ type: 'timetz' })
  from: string;

  @Column({ type: 'timetz' })
  to: string;

  @ManyToOne(() => AdmissionStaff )
  @JoinColumn({ name: 'admission_staff_id' })
  uploadBy: AdmissionStaff;
}
