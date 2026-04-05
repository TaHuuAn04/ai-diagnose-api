import { PageDto } from "@app/core/dtos";

import {
  GetActiveDoctorsResponseDto,
  GetListAppointmentsRequestDto,
  GetListAppointmentsResponseDto,
  GetScheduleRequestDto, GetScheduleResponseDto, GetTodayAppointmentsRequestDto,
  GetTodayAppointmentsResponseDto,
  StaffDashboardStatisticsDto
} from "../dtos";

export interface IStaffService {
  getTodayAppointments(
    staffId: string,
    request: GetTodayAppointmentsRequestDto
  ): Promise<GetTodayAppointmentsResponseDto[]>;

  getActiveDoctors(
    staffId: string,
    date: string
  ): Promise<GetActiveDoctorsResponseDto[]>;

  getListAppointments(
    request: GetListAppointmentsRequestDto
  ): Promise<PageDto<GetListAppointmentsResponseDto>>;

  getStaffInfoDashboard(
    staffId: string,
    request: GetTodayAppointmentsRequestDto
  ): Promise<StaffDashboardStatisticsDto>;

  getScheduleInfo(
    staffId: string,
    request: GetScheduleRequestDto
  ): Promise<GetScheduleResponseDto[]>;
}