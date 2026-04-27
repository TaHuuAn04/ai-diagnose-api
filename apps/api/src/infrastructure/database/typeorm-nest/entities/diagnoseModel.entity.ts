import { Column, Entity, OneToMany} from 'typeorm';

import { BaseEntity } from '../base.entity';
import { ModelConfig } from '@app/core/domain/entities';

import { AIDiagnosisResult } from './AIDiagnosisResult.entity';

@Entity()
export class DiagnoseModel extends BaseEntity {
  @Column({ type: 'varchar', length: 10 })
  version: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ type: 'jsonb', default: {} })
  modelConfig: ModelConfig;

  @Column({ type: 'varchar', length: 255, nullable: true })
  modelUrl: string;

  @OneToMany(() => AIDiagnosisResult, (results) => results.generateBy)
  results: AIDiagnosisResult[];
}
