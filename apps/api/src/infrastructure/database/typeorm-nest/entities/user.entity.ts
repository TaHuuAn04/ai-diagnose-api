import { Column, Entity, Index} from 'typeorm';

import { UserGender, UserRole } from '@app/core/domain/enums';

import { BaseEntity } from '../base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserGender })
  gender: UserGender;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: string | null;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  phoneCode?: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber?: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  @Index()
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string | null;

  @Column({ type: 'boolean', nullable: true, default: false })
  isOnBoardingCompleted: boolean;
}
