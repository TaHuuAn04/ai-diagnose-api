import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { DiagnosisResult } from './diagnosisResult.entity';
import { Disease } from './disease.entity';

@Entity()
export class ResultDisease {
  @PrimaryColumn('uuid')
  resultId: string;
    
  @PrimaryColumn('uuid')
  diseaseId: string;

  @ManyToOne(() => Disease)
  @JoinColumn({ name: 'disease_id' }) 
  disease: Disease;

  @ManyToOne(() => DiagnosisResult)
  @JoinColumn({ name: 'result_id' }) 
  result: DiagnosisResult;

}
