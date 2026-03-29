import {
  CreateAdmissionStaffAccountRequestDto,
  CreateAdmissionStaffAccountResponseDto,
  CreateDoctorAccountRequestDto,
  CreateDoctorAccountResponseDto,
} from '../dtos';

export interface IAdminService {
  createDoctorAccount(
    payload: CreateDoctorAccountRequestDto,
  ): Promise<CreateDoctorAccountResponseDto>;

  createAdmissionStaffAccount(
    payload: CreateAdmissionStaffAccountRequestDto,
  ): Promise<CreateAdmissionStaffAccountResponseDto>;
}
