import { ScheduleEntity } from '@app/core/domain/entities';
import { WorkingTimeEntity } from '@app/core/domain/entities/working-time';

import { GetTodayAppointmentsRequestDto } from '../../modules/staff/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IWorkingTimeRepository extends IGenericRepository<WorkingTimeEntity> {
  findWorkingTimesByScheduleInfo(
    schedule: ScheduleEntity
  ): Promise<WorkingTimeEntity[]>;

  deleteManyByObjects(
    objects: WorkingTimeEntity[]
  ): Promise<number>;

  findAvailableShifts(
    department: string,
    request: GetTodayAppointmentsRequestDto
  ): Promise<WorkingTimeEntity[]>;
}