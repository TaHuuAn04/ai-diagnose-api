import { Body, Controller, Get, Param, Patch, Post, Query , UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommandBus , QueryBus} from "@nestjs/cqrs";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam , ApiResponse, ApiTags} from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";
import { plainToInstance } from "class-transformer";

import { RolesGuard } from "@app/core";
import { CurrentUser, IsPublic, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos";

import { UpdateOrDeleteResponseDto } from "../../common/dtos";

import {
  CreateAiDiagnosisRequestDto,
  CreateAiDiagnosisResponseDto,
  DoctorDashboardStatisticsDto,
  FinishExaminationRequestDto,
  GetAiDiagnosisResultResponseDto,
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
  HandleAiDiagnosisCallbackRequestDto,
  StartExaminationRequestDto,
  StartExaminationResponseDto,
  UpdateDoctorInfoRequestDto
} from "./dtos";
import {
  CreateAiDiagnosisCommand,
  FinishExaminationCommand,
  GetAiDiagnosisResultQuery,
  GetAppointmentCalendarQuery,
  GetAppointmentDatesQuery,
  GetConsultationDetailQuery,
  GetDoctorConsultationHistoryQuery,
  GetDoctorDashboardStatisticsQuery,
  GetDoctorInfoQuery,
  GetListDoctorQuery,
  GetPersonalAppointmentsQuery,
  HandleAiDiagnosisCallbackCommand,
  StartExaminationCommand,
  UpdateDoctorInfoCommand
} from "./use-cases";

@ApiTags('Doctors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller("doctors")
export class DoctorController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Get list of doctors with optional filters' })
  @ApiResponse({ status: 200, description: 'List of doctors retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getListDoctors(
    @Query() request: GetListDoctorRequestDto
  ): Promise<PageDto<GetDoctorResponseDto>> {
    const query = new GetListDoctorQuery(request);

    const result = await this.queryBus.execute<
      GetListDoctorQuery,
      PageDto<GetDoctorResponseDto>
    >(query);

    return result;
  }

  @Get('info/:doctorId')
  @IsPublic()
  @ApiOperation({ summary: 'Get doctor information by ID' })
  @ApiParam({ name: 'doctorId', type: 'string', description: 'ID of the doctor' })
  @ApiResponse({ status: 200, description: 'Doctor information retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getDoctorInfo(
    @Param('doctorId') doctorId: string
  ): Promise<GetDoctorResponseDto> {
    const query = new GetDoctorInfoQuery(doctorId);

    const result = await this.queryBus.execute<
      GetDoctorInfoQuery,
      GetDoctorResponseDto
    >(query);

    return result;
  }

  @Patch('info')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update doctor information' })
  @ApiResponse({ status: 200, description: 'Doctor information updated successfully.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async updateDoctorInfo(
    @CurrentUser() user: UserEntity,
    @Body() request: UpdateDoctorInfoRequestDto
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new UpdateDoctorInfoCommand(
      user.id,
      request
    );

    const result = await this.commandBus.execute<
      UpdateDoctorInfoCommand, UpdateOrDeleteResponseDto
    >(command);

    return result;
  }

  @Get('personal-appointment')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get doctor personal appointments' })
  @ApiResponse({
    status: 200,
    description: "Doctor personal appointments retrieved successfully.",
    type: GetPersonalAppointmentsRequestDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getPersonalAppointments(
    @CurrentUser() user: UserEntity,
    @Query() input: GetPersonalAppointmentsRequestDto
  ): Promise<PageDto<GetPersonalAppointmentsResponseDto>> {
    // Implementation will go here
    const query = new GetPersonalAppointmentsQuery(
      user.id,
      input
    );

    const result = await this.queryBus.execute<
      GetPersonalAppointmentsQuery,
      PageDto<GetPersonalAppointmentsResponseDto>
    >(query);
    
    return result;
  }

  @Get(':doctorId/appointment-calendar')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.STAFF)
  @ApiOperation({ summary: 'Get doctor appointment calendar' })
  @ApiParam({ name: 'doctorId', type: 'string', description: 'ID of the doctor' })
  @ApiResponse({ status: 200, description: 'Doctor appointment calendar retrieved successfully.', type: [GetAppointmentCalendarResponseDto] })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAppointmentCalendar(
    @Param('doctorId') doctorId: string,
    @Query() request: GetAppointmentCalendarRequestDto
  ): Promise<GetAppointmentCalendarResponseDto[]> {
    const query = new GetAppointmentCalendarQuery(doctorId, request);

    const result = await this.queryBus.execute<
      GetAppointmentCalendarQuery,
      GetAppointmentCalendarResponseDto[]
    >(query);

    return result;
  }

  @Get(':doctorId/appointment-date/:date')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.STAFF)
  @ApiOperation({ summary: 'Get doctor appointment dates' })
  @ApiParam({ name: 'doctorId', type: 'string', description: 'ID of the doctor' })
  @ApiParam({ name: 'date', type: 'string', description: 'Date for which to retrieve appointments' })
  @ApiResponse({ status: 200, description: 'Doctor appointment dates retrieved successfully.', type: [String] })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAppointmentDates(
    @Param('doctorId') doctorId: string,
    @Param('date') date: string
  ): Promise<GetAppointmentCalendarResponseDto> {
    const query = new GetAppointmentDatesQuery(doctorId, date);

    const result = await this.queryBus.execute<
      GetAppointmentDatesQuery,
      GetAppointmentCalendarResponseDto
    >(query);

    return result;
  }

  @Get('/doctor-info-dashboard')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get doctor dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: "Doctor dashboard statistics retrieved successfully.",
    type: DoctorDashboardStatisticsDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getCurrentDayAppointments(
    @CurrentUser() user: UserEntity,
    @Query() input: GetDoctorDashboardRequestDto
  ): Promise<DoctorDashboardStatisticsDto> {
    // Implementation will go here
    const query = new GetDoctorDashboardStatisticsQuery(
      user.id,
      input
    );

    const result = await this.queryBus.execute<
      GetDoctorDashboardStatisticsQuery,
      DoctorDashboardStatisticsDto
    >(query);
    
    return result;
  }

  @Post('ai-diagnosis')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create an AI diagnosis job' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAiDiagnosisRequestDto })
  @ApiResponse({ status: 201, description: 'Job created', type: CreateAiDiagnosisResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async createAiDiagnosis(
    @Body() request: CreateAiDiagnosisRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateAiDiagnosisResponseDto> {
    const imageBase64 = file.buffer.toString('base64');
    
    const command = new CreateAiDiagnosisCommand(request, imageBase64);

    return this.commandBus.execute<CreateAiDiagnosisCommand, CreateAiDiagnosisResponseDto>(command);
  }

  @Get('ai-diagnosis/:consultationId')
  @Roles(UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Get AI diagnosis result' })
  @ApiParam({ name: 'consultationId', type: 'string' })
  @ApiResponse({ status: 200, type: GetAiDiagnosisResultResponseDto })
  async getAiDiagnosisResult(
    @Param('consultationId') consultationId: string,
  ): Promise<GetAiDiagnosisResultResponseDto> {
    const query = new GetAiDiagnosisResultQuery(consultationId);

    const result = await this.queryBus.execute<GetAiDiagnosisResultQuery, GetAiDiagnosisResultResponseDto>(query);
    return result;
  }

  @Post('start-examination')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Start patient examination' })
  @ApiBody({ type: StartExaminationRequestDto })
  @ApiResponse({ status: 201, description: 'Examination started successfully', type: StartExaminationResponseDto })
  async startExamination(
    @CurrentUser() user: UserEntity,
    @Body() request: StartExaminationRequestDto,
  ): Promise<StartExaminationResponseDto> {
    const consultationId = await this.commandBus.execute<StartExaminationCommand, string>(
      new StartExaminationCommand(user.id, request.appointmentId, request.patientId)
    );

    return plainToInstance(StartExaminationResponseDto, { consultationId });
  }

  @Post('finish-examination')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Finish patient examination' })
  @ApiBody({ type: FinishExaminationRequestDto })
  @ApiResponse({ status: 200, description: 'Examination finished successfully' })
  async finishExamination(
    @CurrentUser() user: UserEntity,
    @Body() request: FinishExaminationRequestDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new FinishExaminationCommand(user.id, request)
    );
  }

  @Post('ai-diagnosis/callback')
  @IsPublic() // This should be public since worker calls it over local network. Maybe add internal middleware later.
  @ApiOperation({ summary: 'Callback for AI diagnosis worker (Internal)' })
  @ApiBody({ type: HandleAiDiagnosisCallbackRequestDto })
  @ApiResponse({ status: 201, description: 'Result saved successfully' })
  async handleAiDiagnosisCallback(
    @Body() request: HandleAiDiagnosisCallbackRequestDto,
  ): Promise<void> {
    const command = new HandleAiDiagnosisCallbackCommand(request);
    await this.commandBus.execute(command);
  }

  @Get('consultation-history')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get doctor consultation history' })
  @ApiResponse({
    status: 200,
    description: "Doctor consultation history retrieved successfully.",
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "Internal server error." })
  async getConsultationHistory(
    @CurrentUser() user: UserEntity,
    @Query() request: GetDoctorConsultationHistoryRequestDto
  ): Promise<PageDto<GetDoctorConsultationHistoryResponseDto>> {
    const query = new GetDoctorConsultationHistoryQuery(
      user.id,
      request
    );

    return this.queryBus.execute<
      GetDoctorConsultationHistoryQuery,
      PageDto<GetDoctorConsultationHistoryResponseDto>
    >(query);
  }

  @Get('consultations/:consultationId/detail')
  @UseGuards(RolesGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get consultation detail for doctor' })
  @ApiResponse({
    status: 200,
    description: "Consultation detail retrieved successfully.",
    type: GetConsultationDetailResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 404, description: "Consultation not found." })
  @ApiResponse({ status: 500, description: "Internal server error." })
  async getConsultationDetail(
    @CurrentUser() user: UserEntity,
    @Param('consultationId') consultationId: string
  ): Promise<GetConsultationDetailResponseDto> {
    const query = new GetConsultationDetailQuery(
      user.id,
      consultationId
    );

    return this.queryBus.execute<
      GetConsultationDetailQuery,
      GetConsultationDetailResponseDto
    >(query);
  }
}
