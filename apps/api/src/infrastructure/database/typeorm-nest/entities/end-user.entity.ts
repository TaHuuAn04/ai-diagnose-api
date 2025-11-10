import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../base.entity';

@Entity()
export class EndUser extends BaseEntity {
  @Column({ unique: true })
  userEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userName: string;
}
