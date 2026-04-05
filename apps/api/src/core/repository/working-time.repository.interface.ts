import { WorkingTimeEntity } from '@app/core/domain/entities/working-time';

import { GetTodayAppointmentsRequestDto } from '../../modules/staff/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IWorkingTimeRepository extends IGenericRepository<WorkingTimeEntity> {
  findAvailableShifts(
    department: string,
    request: GetTodayAppointmentsRequestDto
  ): Promise<WorkingTimeEntity[]>;
}