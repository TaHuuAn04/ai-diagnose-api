import { AppointmentEntity } from '@app/core/domain/entities';
import { PaginatedResult } from '@app/core/dtos';

import { GetListAppointmentDto } from '../../modules/appointment/dtos';
import { GetAppointmentCalendarResponseDto, GetPersonalAppointmentsRequestDto } from '../../modules/doctor/dtos';
import { GetListAppointmentsRequestDto } from '../../modules/staff/dtos';

import { IGenericRepository } from './generic-repository.interface';

export interface IAppointmentRepository extends IGenericRepository<AppointmentEntity> {
  findListAppointments(
    userId: string,
    request: GetListAppointmentDto
  ): Promise<PaginatedResult<AppointmentEntity>>;

  findListAppointmentsForStaff(
    request: GetListAppointmentsRequestDto
  ): Promise<PaginatedResult<AppointmentEntity>>;

  findUpcomingAppointment(
    userId: string
  ): Promise<AppointmentEntity | null>;

  findTodayAppointmentsForStaff(
    department: string,
    date: string, 
    from?: string
  ): Promise<AppointmentEntity[]>;

  countPeriodExaminedAppointments(
    doctorId: string,
    startDate: string,
    endDate: string,
  ): Promise<number>;

  countDistinctPatientsInPeriodExaminedAppointments(
    doctorId: string,
    startDate: string,
    endDate: string,
  ): Promise<number>;

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
  ): Promise<GetAppointmentCalendarResponseDto>;

  findDoctorAppointments(
    doctorId: string,
    input: GetPersonalAppointmentsRequestDto
  ): Promise<PaginatedResult<AppointmentEntity>>;
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
  
  