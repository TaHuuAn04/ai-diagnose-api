import { PageDto } from '@app/core/dtos';

import {
  DoctorDashboardStatisticsDto,
  GetAppointmentCalendarRequestDto,
  GetAppointmentCalendarResponseDto,
  GetConsultationDetailResponseDto,
  GetDoctorConsultationHistoryRequestDto,
  GetDoctorConsultationHistoryResponseDto,
  GetDoctorDashboardRequestDto,
  GetDoctorResponseDto,
  GetListDoctorRequestDto,
  GetPersonalAppointmentsRequestDto,
  GetPersonalAppointmentsResponseDto,
} from './dtos';

export interface IDoctorService {
  getListDoctors(request: GetListDoctorRequestDto): Promise<PageDto<GetDoctorResponseDto>>;

  getDoctorInfo(doctorId: string): Promise<GetDoctorResponseDto>;

  getPersonalAppointments(doctorId: string, request: GetPersonalAppointmentsRequestDto): Promise<PageDto<GetPersonalAppointmentsResponseDto>>;

  getAppointmentCalendar(doctorId: string, request: GetAppointmentCalendarRequestDto): Promise<GetAppointmentCalendarResponseDto[]>;

  getAppointmentDates(doctorId: string, date: string): Promise<GetAppointmentCalendarResponseDto>;

  getDoctorDashboardStatistics(doctorId: string, input: GetDoctorDashboardRequestDto): Promise<DoctorDashboardStatisticsDto>;

  getConsultationHistory(doctorId: string, request: GetDoctorConsultationHistoryRequestDto): Promise<PageDto<GetDoctorConsultationHistoryResponseDto>>;

  getConsultationDetail(doctorId: string, consultationId: string): Promise<GetConsultationDetailResponseDto>;
}
