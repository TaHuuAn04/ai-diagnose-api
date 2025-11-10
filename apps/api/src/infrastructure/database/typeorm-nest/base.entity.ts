import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntityWithoutId {
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}

export abstract class BaseEntity extends BaseEntityWithoutId {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
