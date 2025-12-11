import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

import { SeverityLevel } from '@app/core/domain/enums';

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

  @Column({ type: 'varchar', length: 255 })
  suggestedDiagnosis: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  proof: string
    
  @Column({ type: 'enum', enum: SeverityLevel, nullable: true }) //Maybe no suggested disease
  severityLevel: SeverityLevel

  @OneToOne(() => Consultation)
  @JoinColumn({ name: 'consultation_id' }) 
  consultation: Consultation;

  @ManyToOne(() => DiagnoseModel)
  @JoinColumn({ name: 'diagnose_model_id' }) 
  generateBy: DiagnoseModel;

  @OneToMany(() => AIResultDisease, (diseases) => diseases.result)
  diseases: AIResultDisease[];
}
