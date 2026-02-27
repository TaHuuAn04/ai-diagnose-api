 
import { DoctorEntity } from '@app/core/domain/entities';

import { GetListDoctorRequestDto } from '../../modules/doctor/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IDoctorRepository extends IGenericRepository<DoctorEntity> {
  findListDoctors(
    request: GetListDoctorRequestDto
  ): Promise<DoctorEntity[]>;
}
