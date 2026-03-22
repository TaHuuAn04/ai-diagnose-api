import { AppointmentEntity } from '@app/core/domain/entities';
import { PaginatedResult } from '@app/core/dtos';

import { GetListAppointmentDto } from '../../modules/appointment/dtos';
import { GetAppointmentCalendarResponseDto } from '../../modules/doctor/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IAppointmentRepository extends IGenericRepository<AppointmentEntity> {
  findListAppointments(
    userId: string,
    request: GetListAppointmentDto
  ): Promise<PaginatedResult<AppointmentEntity>>;

  findUpcomingAppointment(
    userId: string
  ): Promise<AppointmentEntity | null>;

  findAppointmentsForCalendarByMonth(
    doctorId: string,
    startDate: string,
    endDate: string,
    take?: number
  ): Promise<AppointmentCalendarRawResult>;

  findAppointmentsForCalendarByYear(
    doctorId: string,
    year: number,
    month: number,
  ): Promise<GetAppointmentCalendarResponseDto>
}

export interface AppointmentRawResult {
  appointment_id?: string;
  id?: string;
  day_total: string;
}

export class AppointmentCalendarRawResult {
  entities: AppointmentEntity[];
  raw?: AppointmentRawResult[];
}
  
  