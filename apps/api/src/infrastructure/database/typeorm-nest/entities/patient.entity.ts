import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Patient {
  @PrimaryColumn('uuid')
  userId: string; 

  @Column({ type: 'date', nullable: true })
  dob: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  phoneCode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;
    
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) 
  user: User;
}
