import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../base.entity';

import { AIResultDisease } from './AIResultDisease.entity';
import { DataInstance } from './dataInstance.entity';
import { ResultDisease } from './resultDisease.entity';

@Entity()
export class Disease extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string

  @OneToMany(() => DataInstance, (datas) => datas.disease)
  datas: DataInstance[];

  @OneToMany(() => ResultDisease, (results) => results.disease)
  results: ResultDisease[];

  @OneToMany(() => AIResultDisease, (resultAIs) => resultAIs.disease)
  resultAIs: AIResultDisease[];
}
