import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { SeverityLevel } from '@app/core/domain/enums';
import { SuggestedDiagnosis } from '@app/core/domain/entities/ai-diagnosis-result';

import { BaseEntity } from '../base.entity';

import { AIResultDisease } from './AIResultDisease.entity';
import { Consultation } from './consultation.entity';
import { DiagnoseModel } from './diagnoseModel.entity';

@Entity()
export class AIDiagnosisResult extends BaseEntity {
  @Column('uuid')
  consultationId: string;

  @Column('uuid')
  diagnoseModelId: string;

  @Column({ type: 'jsonb', default: [] })
  suggestedDiagnosis: SuggestedDiagnosis[];

  @Column({ type: 'text', nullable: true })
  proof?: string | null;

  @Column({ type: 'text', nullable: true })
  aiAdvice?: string | null;
    
  @Column({ type: 'enum', enum: SeverityLevel, nullable: true })
  severityLevel?: SeverityLevel | null;

  @OneToOne(() => Consultation)
  @JoinColumn({ name: 'consultation_id' }) 
  consultation?: Consultation | null;

  @ManyToOne(() => DiagnoseModel)
  @JoinColumn({ name: 'diagnose_model_id' }) 
  generateBy?: DiagnoseModel | null;

  @OneToMany(() => AIResultDisease, (diseases) => diseases.result)
  diseases: AIResultDisease[];
}
