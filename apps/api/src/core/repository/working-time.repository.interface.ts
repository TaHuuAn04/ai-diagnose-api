import { WorkingTimeEntity } from '@app/core/domain/entities/working-time';
import { PageOptionsDto } from '@app/core/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IWorkingTimeRepository extends IGenericRepository<WorkingTimeEntity> {
  findAvailableShiftsByDoctor(
    doctorId: string,
    startDate?: string,
    endDate?: string,
    pageOptions?: PageOptionsDto
  ): Promise<WorkingTimeEntity[]>;
  
  countAvailableShiftsByDoctor(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<number>;
}