 
import { DoctorEntity } from '@app/core/domain/entities';
import { PaginatedResult } from '@app/core/dtos';

import { GetListDoctorRequestDto } from '../../modules/doctor/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IDoctorRepository extends IGenericRepository<DoctorEntity> {
  findListDoctors(
    request: GetListDoctorRequestDto
  ): Promise<PaginatedResult<DoctorEntity>>;

  findActiveDoctors(
    department: string,
    date: string
  ): Promise<DoctorEntity[]>;
}
