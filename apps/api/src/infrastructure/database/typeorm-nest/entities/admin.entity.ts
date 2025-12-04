import { Entity, JoinColumn, OneToOne} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Admin {
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) 
  user: User;
}
