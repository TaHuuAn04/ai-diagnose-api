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
  DoctorPatientItemResponseDto,
  PatientConsultationItemResponseDto,
  DiagnoseModelResponseDto,
  DoctorPerformanceStatisticsResponseDto,
  GetDoctorPerformanceStatisticsRequestDto,
  GetDoctorPatientsRequestDto,
  GetListChatbotModelsRequestDto,
  GetListDiagnoseModelsRequestDto,
  GetListPatientRequestDto,
  GetListStaffRequestDto,
  GetPatientResponseDto,
  GetStaffResponseDto,
  GetSystemOverviewRequestDto,
  SystemOverviewResponseDto,
  TopDiseaseItemResponseDto,
  UpdateAdmissionStaffAccountRequestDto,
  UpdateAdmissionStaffAccountResponseDto,
  UpdateChatbotModelRequestDto,
  UpdateDiagnoseModelRequestDto,
  UpdateDoctorAccountRequestDto,
  UpdateDoctorAccountResponseDto,
  UpdatePatientOnboardingRequestDto,
  UpdatePatientOnboardingResponseDto,
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

  getTopDiseasesStatistics(
    query: GetDoctorPatientsRequestDto,
  ): Promise<TopDiseaseItemResponseDto[]>;

  getDoctorPatients(
    doctorId: string,
    query: GetDoctorPatientsRequestDto,
  ): Promise<DoctorPatientItemResponseDto[]>;

  getPatientConsultationsByDoctor(
    doctorId: string,
    patientId: string,
    query: GetDoctorPatientsRequestDto,
  ): Promise<PatientConsultationItemResponseDto[]>;

  updatePatientOnboarding(
    id: string,
    payload: UpdatePatientOnboardingRequestDto,
  ): Promise<UpdatePatientOnboardingResponseDto>;
}
