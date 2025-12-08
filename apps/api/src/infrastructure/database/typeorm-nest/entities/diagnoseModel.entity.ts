import { Column, Entity, OneToMany} from 'typeorm';

import { BaseEntity } from '../base.entity';

import { AIDiagnosisResult } from './AIDiagnosisResult.entity';

@Entity()
export class DiagnoseModel extends BaseEntity {
  @Column({ type: 'varchar', length: 10 })
  version: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ type: 'varchar', length: 255, unique: true })
  keyModel: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  modelUrl: string;

  @OneToMany(() => AIDiagnosisResult, (results) => results.generateBy)
  results: AIDiagnosisResult[];
}
