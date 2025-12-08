import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { AIDiagnosisResult } from './AIDiagnosisResult.entity';
import { Disease } from './disease.entity';

@Entity()
export class AIResultDisease {
  @PrimaryColumn('uuid')
  resultId: string;
    
  @PrimaryColumn('uuid')
  diseaseId: string;

  @ManyToOne(() => Disease)
  @JoinColumn({ name: 'disease_id' }) 
  disease: Disease;

  @ManyToOne(() => AIDiagnosisResult)
  @JoinColumn({ name: 'result_id' }) 
  result: AIDiagnosisResult;
}
