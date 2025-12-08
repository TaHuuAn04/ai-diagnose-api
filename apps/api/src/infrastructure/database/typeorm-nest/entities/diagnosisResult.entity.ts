import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../base.entity';

import { Consultation } from './consultation.entity';
import { ResultDisease } from './resultDisease.entity';

@Entity()
export class DiagnosisResult extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  advices: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  prescription: string
    
  @Column({ type: 'varchar', length: 255 })
  symstomsText: string

  @Column('uuid')
  consultationId: string;

  @OneToOne(() => Consultation)
  @JoinColumn({ name: 'consultation_id' }) 
  consultation: Consultation;

  @OneToMany(() => ResultDisease, (diseases) => diseases.result)
  diseases: ResultDisease[];
}
