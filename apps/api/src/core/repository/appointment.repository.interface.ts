import { AppointmentEntity } from '@app/core/domain/entities';
import { PaginatedResult } from '@app/core/dtos';

import { GetListAppointmentDto } from '../../modules/appointment/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IAppointmentRepository extends IGenericRepository<AppointmentEntity> {
  findListAppointments(
    userId: string,
    request: GetListAppointmentDto
  ): Promise<PaginatedResult<AppointmentEntity>>;

  findUpcomingAppointment(
    userId: string
  ): Promise<AppointmentEntity | null>;
}
