import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { BaseEntityWithoutId } from '../base.entity';

import { DiagnosisResult } from './diagnosisResult.entity';
import { Disease } from './disease.entity';

@Entity()
export class ResultDisease extends BaseEntityWithoutId {
  @PrimaryColumn('uuid')
  resultId: string;
    
  @PrimaryColumn('uuid')
  diseaseId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => Disease)
  @JoinColumn({ name: 'disease_id' }) 
  disease: Disease;

  @ManyToOne(() => DiagnosisResult)
  @JoinColumn({ name: 'result_id' }) 
  result: DiagnosisResult;

}
