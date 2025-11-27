import { Column, Entity, Index } from 'typeorm';

import { UserRole } from '@app/core/domain/enums';

import { BaseEntity } from '../base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  phoneCode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  @Index()
  role: UserRole;

  @Column({ type: 'boolean', nullable: true, default: false })
  isOnBoardingCompleted: boolean;
}
