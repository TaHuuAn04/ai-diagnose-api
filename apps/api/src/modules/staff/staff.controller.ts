import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { CurrentUser, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos";
import { RolesGuard } from "@app/core/guards";

import {
  GetActiveDoctorsResponseDto,
  GetListAppointmentsRequestDto,
  GetListAppointmentsResponseDto, GetScheduleRequestDto, GetScheduleResponseDto,
  GetTodayAppointmentsRequestDto,
  GetTodayAppointmentsResponseDto,
  StaffDashboardStatisticsDto
} from "./dtos";
import {
  GetActiveDoctorsQuery,
  GetListAppointmentsQuery,
  GetScheduleQuery, GetStaffInfoDashboardQuery,
  GetTodayAppointmentsQuery
} from "./use-cases";


@ApiTags('Staffs')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles(UserRole.STAFF)
@ApiBearerAuth('access-token')
@Controller("staffs")
export class StaffController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('/today-appointments')
  @ApiOperation({ summary: "Get list of today appointments" })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: GetTodayAppointmentsResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getTodayAppointments(
    @CurrentUser() user: UserEntity,
    @Query() input: GetTodayAppointmentsRequestDto
  ): Promise<GetTodayAppointmentsResponseDto[]> {
    const query = new GetTodayAppointmentsQuery(
      user.id,
      input
    );

    const result = await this.queryBus.execute<
      GetTodayAppointmentsQuery, GetTodayAppointmentsResponseDto[]
    >(query);

    return result;
  }

  @Get('/active-doctors/:date')
  @ApiOperation({ summary: "Get list of active doctors" })
  @ApiParam({ name: 'date', description: "Current Date", type: String })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: GetActiveDoctorsResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getActiveDoctors(
    @CurrentUser() user: UserEntity,
    @Param('date') date: string
  ): Promise<GetActiveDoctorsResponseDto[]> {
    const query = new GetActiveDoctorsQuery(
      user.id,
      date
    );

    const result = await this.queryBus.execute<
      GetActiveDoctorsQuery, GetActiveDoctorsResponseDto[]
    >(query);

    return result;
  }
  
  @Get('/appointments')
  @ApiOperation({ summary: "Get all list of appointments" })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: PageDto<GetListAppointmentsResponseDto>
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getListAppointments(
    @Query() input: GetListAppointmentsRequestDto
  ): Promise<PageDto<GetListAppointmentsResponseDto>> {
    const query = new GetListAppointmentsQuery(
      input
    );

    const result = await this.queryBus.execute<
      GetListAppointmentsQuery, PageDto<GetListAppointmentsResponseDto>
    >(query);

    return result;
  }

  @Get('/staff-info-dashboard')
  @ApiOperation({ summary: "Get staff dashboard statistics" })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: StaffDashboardStatisticsDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getStaffInfoDashboard(
    @CurrentUser() user: UserEntity,
    @Query() input: GetTodayAppointmentsRequestDto
  ): Promise<StaffDashboardStatisticsDto> {
    const query = new GetStaffInfoDashboardQuery(
      user.id,
      input
    );

    const result = await this.queryBus.execute<
      GetStaffInfoDashboardQuery, StaffDashboardStatisticsDto
    >(query);

    return result;
  }

  @Get('/schedule')
  @ApiOperation({ summary: "Get information of schedule" })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: GetScheduleResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getSchedule(
    @CurrentUser() user: UserEntity,
    @Query() input: GetScheduleRequestDto
  ): Promise<GetScheduleResponseDto[]> {
    const query = new GetScheduleQuery(
      user.id,
      input
    );

    const result = await this.queryBus.execute<
      GetScheduleQuery, GetScheduleResponseDto[]
    >(query);

    return result;
  }
}