import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntityWithoutId } from '../base.entity';

import { AIDiagnosisResult } from './AIDiagnosisResult.entity';
import { Disease } from './disease.entity';

@Entity()
export class AIResultDisease extends BaseEntityWithoutId {
  @PrimaryColumn('uuid')
  resultId: string;

  @PrimaryColumn('uuid')
  diseaseId: string;

  @PrimaryColumn({ type: 'int', default: 0 })
  lesionIndex: number;

  @Column({ type: 'float' })
  accuracy: number;

  @ManyToOne(() => Disease)
  @JoinColumn({ name: 'disease_id' }) 
  disease: Disease;

  @ManyToOne(() => AIDiagnosisResult)
  @JoinColumn({ name: 'result_id' }) 
  result: AIDiagnosisResult;
}
