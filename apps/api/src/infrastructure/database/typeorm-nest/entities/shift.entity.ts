import { Column, Entity, OneToMany } from 'typeorm';

import { ShiftStatus } from '@app/core/domain/enums';

import { BaseEntity } from '../base.entity';

import { WorkingTime } from './workingTime.entity';

@Entity()
export class Shift extends BaseEntity {
  @Column({ type: 'timetz' })
  from: string;

  @Column({ type: 'timetz' })
  to: string;

  @Column({ type: 'enum', enum: ShiftStatus, default: ShiftStatus.AVAILABLE })
  status: ShiftStatus;

  @OneToMany(() => WorkingTime, (workingTime) => workingTime.shift)
  workingTime: WorkingTime[];
}
