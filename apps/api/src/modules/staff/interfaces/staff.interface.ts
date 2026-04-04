import { GetActiveDoctorsResponseDto, GetScheduleRequestDto, GetScheduleResponseDto, GetTodayAppointmentsRequestDto, GetTodayAppointmentsResponseDto } from "../dtos";

export interface IStaffService {
  getTodayAppointments(
    staffId: string,
    request: GetTodayAppointmentsRequestDto
  ): Promise<GetTodayAppointmentsResponseDto[]>;

  getActiveDoctors(
    staffId: string,
    date: string
  ): Promise<GetActiveDoctorsResponseDto[]>;

  getScheduleInfo(
    staffId: string,
    request: GetScheduleRequestDto
  ): Promise<GetScheduleResponseDto[]>;
}