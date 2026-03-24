import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DoctorDashboardStatisticsDto {
  @Expose()
  examinationsCount: number;    
    
  @Expose()
  totalAppointmentsCount: number;

  @Expose()
  cancelledAppointmentsCount: number;

  @Expose()
  currentWeekPatientsCount: number;

  @Expose()
  previousWeekPatientsCount: number;

  @Expose()
  currentMonthAppointmentsCount: number;

  @Expose()
  previousMonthAppointmentsCount: number;
}