import { PageDto } from '@app/core/dtos';

import {
  ChatbotModelResponseDto,
  CreateAdmissionStaffAccountRequestDto,
  CreateAdmissionStaffAccountResponseDto,
  CreateChatbotModelRequestDto,
  CreateDiagnoseModelRequestDto,
  CreateDoctorAccountRequestDto,
  CreateDoctorAccountResponseDto,
  DeleteAdmissionStaffAccountResponseDto,
  DeleteDoctorAccountResponseDto,
  DiagnoseModelResponseDto,
  DoctorPerformanceStatisticsResponseDto,
  GetDoctorPerformanceStatisticsRequestDto,
  GetListChatbotModelsRequestDto,
  GetListDiagnoseModelsRequestDto,
  GetListPatientRequestDto,
  GetListStaffRequestDto,
  GetPatientResponseDto,
  GetStaffResponseDto,
  GetSystemOverviewRequestDto,
  SystemOverviewResponseDto,
  UpdateAdmissionStaffAccountRequestDto,
  UpdateAdmissionStaffAccountResponseDto,
  UpdateChatbotModelRequestDto,
  UpdateDiagnoseModelRequestDto,
  UpdateDoctorAccountRequestDto,
  UpdateDoctorAccountResponseDto,
  UserStatisticsResponseDto,
} from '../dtos';


export interface IAdminService {
  createDoctorAccount(
    payload: CreateDoctorAccountRequestDto,
  ): Promise<CreateDoctorAccountResponseDto>;
  
  getUserStatistics(): Promise<UserStatisticsResponseDto>;

  getListStaffs(
    query: GetListStaffRequestDto,
  ): Promise<PageDto<GetStaffResponseDto>>;

  getListPatients(
    query: GetListPatientRequestDto,
  ): Promise<PageDto<GetPatientResponseDto>>;

  updateDoctorAccount(
    id: string,
    payload: UpdateDoctorAccountRequestDto,
  ): Promise<UpdateDoctorAccountResponseDto>;

  deleteDoctorAccount(
    id: string,
  ): Promise<DeleteDoctorAccountResponseDto>;

  createAdmissionStaffAccount(
    payload: CreateAdmissionStaffAccountRequestDto,
  ): Promise<CreateAdmissionStaffAccountResponseDto>;

  updateAdmissionStaffAccount(
    id: string,
    payload: UpdateAdmissionStaffAccountRequestDto,
  ): Promise<UpdateAdmissionStaffAccountResponseDto>;

  deleteAdmissionStaffAccount(
    id: string,
  ): Promise<DeleteAdmissionStaffAccountResponseDto>;

  createDiagnoseModel(
    payload: CreateDiagnoseModelRequestDto,
  ): Promise<DiagnoseModelResponseDto>;

  updateDiagnoseModel(
    id: string,
    payload: UpdateDiagnoseModelRequestDto,
  ): Promise<DiagnoseModelResponseDto>;

  deleteDiagnoseModel(
    id: string,
  ): Promise<boolean>;

  getListDiagnoseModels(
    query: GetListDiagnoseModelsRequestDto,
  ): Promise<PageDto<DiagnoseModelResponseDto>>;

  createChatbotModel(
    payload: CreateChatbotModelRequestDto,
  ): Promise<ChatbotModelResponseDto>;

  updateChatbotModel(
    id: string,
    payload: UpdateChatbotModelRequestDto,
  ): Promise<ChatbotModelResponseDto>;

  deleteChatbotModel(
    id: string,
  ): Promise<boolean>;

  getListChatbotModels(
    query: GetListChatbotModelsRequestDto,
  ): Promise<PageDto<ChatbotModelResponseDto>>;

  getDoctorPerformanceStatistics(
    query: GetDoctorPerformanceStatisticsRequestDto,
  ): Promise<DoctorPerformanceStatisticsResponseDto>;
  
  getSystemOverview(
    query: GetSystemOverviewRequestDto,
  ): Promise<SystemOverviewResponseDto>;
}
