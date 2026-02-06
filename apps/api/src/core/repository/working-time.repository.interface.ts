import { WorkingTimeEntity } from '@app/core/domain/entities/working-time';

import { GetShiftsByDoctorIdRequestDto } from '../../modules/shift/dtos/requests/get-available-shifts.request.dto';

import { IGenericRepository } from './generic-repository.interface';

export interface IWorkingTimeRepository extends IGenericRepository<WorkingTimeEntity> {
  findShiftsByDoctor(
    doctorId: string,
    input: GetShiftsByDoctorIdRequestDto
  ): Promise<WorkingTimeEntity[]>;
  
  countShiftsByDoctor(
    doctorId: string,
    input: GetShiftsByDoctorIdRequestDto
  ): Promise<number>;
}