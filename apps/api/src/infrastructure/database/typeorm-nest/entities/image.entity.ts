import { Column, Entity, Index } from 'typeorm';

import { ImageReference, ImageType } from '@app/core/domain/enums';

import { BaseEntity } from '../base.entity';

@Entity()
@Index(['referenceId', 'referenceType'])
export class Image extends BaseEntity {
  @Column('uuid')
  referenceId: string;

  @Column({ type: 'enum', enum: ImageReference })
  referenceType: ImageReference; 
  
  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'varchar', nullable: true })
  dataUrl?: string | null;

  @Column({ type: 'int', nullable: true })
  order?: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: true })
  base64?: string | null;
  
  @Column({ type: 'enum', enum: ImageType })
  type: ImageType;
}
