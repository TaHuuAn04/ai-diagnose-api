import { PageDto } from '@app/core/dtos';

import { GetDoctorResponseDto, GetListDoctorRequestDto, GetPersonalAppointmentsRequestDto, GetPersonalAppointmentsResponseDto } from './dtos';

export interface IDoctorService {
  getListDoctors(request: GetListDoctorRequestDto): Promise<PageDto<GetDoctorResponseDto>>;

  getDoctorInfo(doctorId: string): Promise<GetDoctorResponseDto>;

  getPersonalAppointments(doctorId: string, request: GetPersonalAppointmentsRequestDto): Promise<PageDto<GetPersonalAppointmentsResponseDto>>;
}
