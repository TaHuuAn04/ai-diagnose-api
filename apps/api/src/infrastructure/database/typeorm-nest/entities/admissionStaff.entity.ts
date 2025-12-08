import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { Schedule } from './schedule.entity';
import { User } from './user.entity';

@Entity()
export class AdmissionStaff {
  @PrimaryColumn('uuid')
  userId: string; 

  @Column({ type: 'varchar', length: 25, unique: true })
  staffCode: string;

  @Column({ type: 'varchar', length: 25 })
  department: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
    
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @OneToMany(() => Schedule, (schedule) => schedule.uploadBy)
  schedule: Schedule[];
}
