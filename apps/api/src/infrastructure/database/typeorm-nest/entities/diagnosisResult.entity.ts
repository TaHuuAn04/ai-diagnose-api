import { PrescriptionItem } from '@app/core/domain/entities/diagnosis-result';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';

import { Consultation } from './consultation.entity';
import { ResultDisease } from './resultDisease.entity';

@Entity()
export class DiagnosisResult extends BaseEntity {
  @Column({ type: 'text', nullable: true })
  advices: string;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  prescription: PrescriptionItem[];

  @Column({ type: 'text', nullable: true })
  description?: string | null;
    
  @Column({ type: 'varchar', length: 255 })
  symstomsText: string

  @Column({ type: 'text', nullable: true })
  feedBackAI?: string | null;

  @Column('uuid')
  consultationId: string;

  @OneToOne(() => Consultation)
  @JoinColumn({ name: 'consultation_id' }) 
  consultation: Consultation;

  @OneToMany(() => ResultDisease, (diseases) => diseases.result)
  diseases: ResultDisease[];
}
