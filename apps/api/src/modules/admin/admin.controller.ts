import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/guards';

import { RolesGuard } from '@app/core';
import { Roles } from '@app/core/decorators';
import { UserRole } from '@app/core/domain/enums';
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
  UserStatisticsResponseDto,
  DoctorPatientItemResponseDto,
  GetDoctorPatientsRequestDto,
  PatientConsultationItemResponseDto,
  TestDifyConnectionRequestDto,
} from './dtos';
import { DoctorPerformanceStatisticsResponseDto } from './dtos/response/doctor-performance-statistics.response.dto';
import { GetDoctorPerformanceStatisticsRequestDto } from './dtos/request/get-doctor-performance-statistics.request.dto';
import {
  CreateAdmissionStaffAccountCommand,
  CreateChatbotModelCommand,
  CreateDiagnoseModelCommand,
  CreateDoctorAccountCommand,
  DeleteAdmissionStaffAccountCommand,
  DeleteChatbotModelCommand,
  DeleteDiagnoseModelCommand,
  DeleteDoctorAccountCommand,
  GetListChatbotModelsQuery,
  GetListDiagnoseModelsQuery,
  GetListPatientQuery,
  GetListStaffQuery,
  GetUserStatisticsQuery,
  GetDoctorPatientsQuery,
  GetPatientConsultationsQuery,
  GetTopDiseasesQuery,
  UpdateAdmissionStaffAccountCommand,
  UpdateChatbotModelCommand,
  UpdateDiagnoseModelCommand,
  UpdateDoctorAccountCommand,
} from './use-cases';
import { GetDoctorPerformanceStatisticsQuery } from './use-cases/get-doctor-performance-statistics.use-case';
import { GetSystemOverviewQuery } from './use-cases/get-system-overview.use-case';
import { GetPassportDifyAiCommand } from '../dify-ai/use-cases';
import { ExternalServiceException } from '@app/core/exception';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('access-token')
@Controller('admin')
@ApiExtraModels(PageDto, DiagnoseModelResponseDto, ChatbotModelResponseDto, DoctorPerformanceStatisticsResponseDto)
export class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('users/statistics')
  @ApiOperation({ summary: 'Get user statistics (role and department distribution)' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    type: UserStatisticsResponseDto,
  })
  async getUserStatistics(): Promise<UserStatisticsResponseDto> {
    const q = new GetUserStatisticsQuery();
    return this.queryBus.execute(q);
  }

  @Post('doctors')
  @ApiOperation({ summary: 'Create a doctor account (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Doctor account created successfully',
    type: CreateDoctorAccountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request / Duplicate data' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async createDoctorAccount(
    @Body() request: CreateDoctorAccountRequestDto,
  ): Promise<CreateDoctorAccountResponseDto> {
    const command = new CreateDoctorAccountCommand(request);
    
    return this.commandBus.execute<
      CreateDoctorAccountCommand,
      CreateDoctorAccountResponseDto
    >(command);
  }

  @Put('doctors/:id')
  @ApiOperation({ summary: 'Update a doctor account by User ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Doctor account updated successfully',
    type: UpdateDoctorAccountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async updateDoctorAccount(
    @Param('id') id: string,
    @Body() request: UpdateDoctorAccountRequestDto,
  ): Promise<UpdateDoctorAccountResponseDto> {
    const command = new UpdateDoctorAccountCommand(id, request);
    
    return this.commandBus.execute<
      UpdateDoctorAccountCommand,
      UpdateDoctorAccountResponseDto
    >(command);
  }

  @Delete('doctors/:id')
  @ApiOperation({ summary: 'Delete a doctor account by User ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Doctor account deleted successfully',
    type: DeleteDoctorAccountResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  async deleteDoctorAccount(
    @Param('id') id: string,
  ): Promise<DeleteDoctorAccountResponseDto> {
    const command = new DeleteDoctorAccountCommand(id);
    
    return this.commandBus.execute<
      DeleteDoctorAccountCommand,
      DeleteDoctorAccountResponseDto
    >(command);
  }

  @Post('staffs')
  @ApiOperation({ summary: 'Create an admission staff account (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Admission staff account created successfully',
    type: CreateAdmissionStaffAccountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request / Duplicate data' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async createAdmissionStaffAccount(
    @Body() request: CreateAdmissionStaffAccountRequestDto,
  ): Promise<CreateAdmissionStaffAccountResponseDto> {
    const command = new CreateAdmissionStaffAccountCommand(request);
    
    return this.commandBus.execute<
      CreateAdmissionStaffAccountCommand,
      CreateAdmissionStaffAccountResponseDto
    >(command);
  }

  @Put('staffs/:id')
  @ApiOperation({ summary: 'Update an admission staff account by User ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Admission staff account updated successfully',
    type: UpdateAdmissionStaffAccountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Staff not found' })
  async updateAdmissionStaffAccount(
    @Param('id') id: string,
    @Body() request: UpdateAdmissionStaffAccountRequestDto,
  ): Promise<UpdateAdmissionStaffAccountResponseDto> {
    const command = new UpdateAdmissionStaffAccountCommand(id, request);
    
    return this.commandBus.execute<
      UpdateAdmissionStaffAccountCommand,
      UpdateAdmissionStaffAccountResponseDto
    >(command);
  }

  @Delete('staffs/:id')
  @ApiOperation({ summary: 'Delete an admission staff account by User ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Admission staff account deleted successfully',
    type: DeleteAdmissionStaffAccountResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  @ApiResponse({ status: 404, description: 'Staff not found' })
  async deleteAdmissionStaffAccount(
    @Param('id') id: string,
  ): Promise<DeleteAdmissionStaffAccountResponseDto> {
    const command = new DeleteAdmissionStaffAccountCommand(id);
    
    return this.commandBus.execute<
      DeleteAdmissionStaffAccountCommand,
      DeleteAdmissionStaffAccountResponseDto
    >(command);
  }

  @Get('staffs')
  @ApiOperation({ summary: 'Get list of admission staff accounts (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of staff accounts retrieved successfully',
    type: PageDto<GetStaffResponseDto>,
  })
  async getListStaffs(
    @Query() query: GetListStaffRequestDto,
  ): Promise<PageDto<GetStaffResponseDto>> {
    const q = new GetListStaffQuery(query);
    return this.queryBus.execute(q);
  }

  @Get('patients')
  @ApiOperation({ summary: 'Get list of patient accounts (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of patient accounts retrieved successfully',
    type: PageDto<GetPatientResponseDto>,
  })
  async getListPatients(
    @Query() query: GetListPatientRequestDto,
  ): Promise<PageDto<GetPatientResponseDto>> {
    const q = new GetListPatientQuery(query);
    return this.queryBus.execute(q);
  }

  @Post('ai-models')
  @ApiOperation({ summary: 'Create a new AI Diagnose Model' })
  @ApiResponse({ status: 201, type: DiagnoseModelResponseDto })
  async createDiagnoseModel(
    @Body() request: CreateDiagnoseModelRequestDto,
  ): Promise<DiagnoseModelResponseDto> {
    const command = new CreateDiagnoseModelCommand(request);
    return this.commandBus.execute(command);
  }

  @Put('ai-models/:id')
  @ApiOperation({ summary: 'Update an existing AI Diagnose Model' })
  @ApiResponse({ status: 200, type: DiagnoseModelResponseDto })
  async updateDiagnoseModel(
    @Param('id') id: string,
    @Body() request: UpdateDiagnoseModelRequestDto,
  ): Promise<DiagnoseModelResponseDto> {
    const command = new UpdateDiagnoseModelCommand(id, request);
    return this.commandBus.execute(command);
  }

  @Delete('ai-models/:id')
  @ApiOperation({ summary: 'Delete an AI Diagnose Model' })
  @ApiResponse({ status: 200, description: 'Deleted correctly' })
  async deleteDiagnoseModel(@Param('id') id: string): Promise<boolean> {
    const command = new DeleteDiagnoseModelCommand(id);
    return this.commandBus.execute(command);
  }

  @Get('ai-models')
  @ApiOperation({ summary: 'Get list of AI Diagnose Models with pagination' })
  async getListDiagnoseModels(
    @Query() query: GetListDiagnoseModelsRequestDto,
  ): Promise<PageDto<DiagnoseModelResponseDto>> {
    const q = new GetListDiagnoseModelsQuery(query);
    return this.queryBus.execute(q);
  }

  @Post('chatbots')
  @ApiOperation({ summary: 'Create a new Chatbot Model' })
  @ApiResponse({ status: 201, type: ChatbotModelResponseDto })
  async createChatbotModel(
    @Body() request: CreateChatbotModelRequestDto,
  ): Promise<ChatbotModelResponseDto> {
    const command = new CreateChatbotModelCommand(request);
    return this.commandBus.execute(command);
  }

  @Put('chatbots/:id')
  @ApiOperation({ summary: 'Update an existing Chatbot Model' })
  @ApiResponse({ status: 200, type: ChatbotModelResponseDto })
  async updateChatbotModel(
    @Param('id') id: string,
    @Body() request: UpdateChatbotModelRequestDto,
  ): Promise<ChatbotModelResponseDto> {
    const command = new UpdateChatbotModelCommand(id, request);
    return this.commandBus.execute(command);
  }

  @Delete('chatbots/:id')
  @ApiOperation({ summary: 'Delete a Chatbot Model' })
  @ApiResponse({ status: 200, description: 'Deleted correctly' })
  async deleteChatbotModel(@Param('id') id: string): Promise<boolean> {
    const command = new DeleteChatbotModelCommand(id);
    return this.commandBus.execute(command);
  }

  @Get('chatbots')
  @ApiOperation({ summary: 'Get list of Chatbot Models with pagination' })
  async getListChatbotModels(
    @Query() query: GetListChatbotModelsRequestDto,
  ): Promise<PageDto<ChatbotModelResponseDto>> {
    const q = new GetListChatbotModelsQuery(query);
    return this.queryBus.execute(q);
  }

  @Get('dashboard/doctor-performance')
  @ApiOperation({ summary: 'Get doctor performance statistics by month/year' })
  @ApiResponse({ status: 200, type: DoctorPerformanceStatisticsResponseDto })
  async getDoctorPerformanceStatistics(
    @Query() query: GetDoctorPerformanceStatisticsRequestDto,
  ): Promise<DoctorPerformanceStatisticsResponseDto> {
    const q = new GetDoctorPerformanceStatisticsQuery(query);
    return this.queryBus.execute(q);
  }

  @Get('dashboard/overview')
  @ApiOperation({ summary: 'Get dashboard system overview statistics by month/year' })
  @ApiResponse({ status: 200, type: SystemOverviewResponseDto })
  async getSystemOverview(
    @Query() query: GetSystemOverviewRequestDto,
  ): Promise<SystemOverviewResponseDto> {
    const q = new GetSystemOverviewQuery(query);
    return this.queryBus.execute(q);
  }

  @Get('dashboard/top-diseases')
  @ApiOperation({ summary: 'Get top 10 diseases statistics by month/year' })
  @ApiResponse({ status: 200, type: [TopDiseaseItemResponseDto] })
  async getTopDiseases(
    @Query() query: GetDoctorPatientsRequestDto,
  ): Promise<TopDiseaseItemResponseDto[]> {
    const q = new GetTopDiseasesQuery(query);
    return this.queryBus.execute(q);
  }

  @Get('dashboard/doctors/:doctorId/patients')
  @ApiOperation({ summary: 'Get list of patients examined by a doctor in a specific month' })
  @ApiResponse({ status: 200, type: [DoctorPatientItemResponseDto] })
  async getDoctorPatients(
    @Param('doctorId') doctorId: string,
    @Query() query: GetDoctorPatientsRequestDto,
  ): Promise<DoctorPatientItemResponseDto[]> {
    const q = new GetDoctorPatientsQuery(doctorId, query);
    return this.queryBus.execute(q);
  }

  @Get('dashboard/doctors/:doctorId/patients/:patientId/consultations')
  @ApiOperation({ summary: 'Get list of consultations for a specific patient by a doctor' })
  @ApiResponse({ status: 200, type: [PatientConsultationItemResponseDto] })
  async getPatientConsultationsByDoctor(
    @Param('doctorId') doctorId: string,
    @Param('patientId') patientId: string,
    @Query() query: GetDoctorPatientsRequestDto,
  ): Promise<PatientConsultationItemResponseDto[]> {
    const q = new GetPatientConsultationsQuery(doctorId, patientId, query);
    return this.queryBus.execute(q);
  }

  @Post('dify/test-connection')
  @ApiOperation({ summary: 'Test Dify API connection with the provided access token' })
  @ApiResponse({ status: 200, description: 'Connection successful' })
  @ApiResponse({ status: 400, description: 'Bad Request / Connection failed' })
  async testDifyConnection(
    @Body() request: TestDifyConnectionRequestDto,
  ): Promise<{ success: boolean; message?: string }> {
    const command = new GetPassportDifyAiCommand({
      headers: { 'x-app-code': request.accessToken },
      query: { user_id: 'admin-test-connection' },
    });
    const response = await this.commandBus.execute(command);
    
    if (response?.access_token) {
      return { success: true, message: 'Connection successful' };
    }
    
    // If we reach here without an exception but no token, throw explicitly
    throw new ExternalServiceException('Invalid token or API error');
  }
}