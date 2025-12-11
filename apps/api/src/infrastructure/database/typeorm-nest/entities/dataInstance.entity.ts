import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';

import { Disease } from './disease.entity';

@Entity()
export class DataInstance extends BaseEntity {
  @Column('uuid')
  diseaseId: string

  @Column({ type: 'varchar' })
  imageUrl: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string

  @ManyToOne(() => Disease)
  @JoinColumn({ name: 'disease_id' }) 
  disease: Disease
}
