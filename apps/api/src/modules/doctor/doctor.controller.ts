import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { RolesGuard } from "@app/core";
import { CurrentUser, IsPublic, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos";

import { GetAppointmentCalendarRequestDto, GetDoctorResponseDto, GetListDoctorRequestDto, GetPersonalAppointmentsRequestDto, GetPersonalAppointmentsResponseDto } from "./dtos";
import { GetAppointmentCalendarResponseDto } from "./dtos/response/get-appointment-calendar.response.dto";
import { GetAppointmentCalendarQuery, GetDoctorInfoQuery, GetListDoctorQuery, GetPersonalAppointmentsQuery } from "./use-cases";
import { GetAppointmentDatesQuery } from "./use-cases/get-appointment-dates.use-case";

@ApiTags('Doctors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller("doctors")
@UseGuards(RolesGuard)
@Roles(UserRole.DOCTOR, UserRole.STAFF)
export class DoctorController {
  constructor(
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
}
