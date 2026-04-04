 
import { ScheduleEntity } from '@app/core/domain/entities';

import { IGenericRepository } from './generic-repository.interface';
import { GetScheduleRequestDto } from '../../modules/staff/dtos';

export interface IScheduleRepository extends IGenericRepository<ScheduleEntity> {
  findSchedulesWithDepartmentForStaff(
    department: string,
    request: GetScheduleRequestDto
  ): Promise<ScheduleEntity[]>;
}
