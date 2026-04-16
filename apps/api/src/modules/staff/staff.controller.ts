import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";
import { Response } from 'express';
import { FormDataRequest } from "nestjs-form-data";

import { CurrentUser, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos";
import { RolesGuard } from "@app/core/guards";

import { UpdateOrDeleteResponseDto } from "../../common/dtos";

import {
  CreateScheduleRequestDto,
  DeleteScheduleRequestDto,
  ExportScheduleToCSVResponseDto,
  GetActiveDoctorsResponseDto,
  GetListAppointmentsRequestDto,
  GetListAppointmentsResponseDto,
  GetScheduleRequestDto,
  GetScheduleResponseDto,
  GetTodayAppointmentsRequestDto,
  GetTodayAppointmentsResponseDto,
  ImportScheduleFromCSVRequestDto,
  StaffDashboardStatisticsDto,
  UpdateScheduleRequestDto
} from "./dtos";
import {
  CreateScheduleCommand,
  DeleteScheduleCommand,
  ExportScheduleToCSVQuery,
  GetActiveDoctorsQuery,
  GetListAppointmentsQuery,
  GetScheduleQuery,
  GetStaffInfoDashboardQuery,
  GetTodayAppointmentsQuery,
  ImportScheduleFromCSVCommand,
  UpdateScheduleCommand
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

  @Get('/export-csv')
  @ApiOperation({ summary: "Export schedule to CSV" })
  @ApiResponse({
    status: 200,
    description: "Schedule exported successfully.",
    type: ExportScheduleToCSVResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to export schedule." })
  async exportSchedule(
    @CurrentUser() user: UserEntity,
    @Query() input: GetScheduleRequestDto,
    @Res() res: Response
  ): Promise<void> {
    const query = new ExportScheduleToCSVQuery(
      user.id,
      input
    );

    const result = await this.queryBus.execute<
      ExportScheduleToCSVQuery, ExportScheduleToCSVResponseDto 
    >(query);

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
    });
    res.send(result.buffer);
  }

  @Post('/schedule')
  @ApiOperation({ summary: "Create manual schedule by date" })
  @ApiResponse({
    status: 200,
    description: "Schedule created successfully.",
    type: GetScheduleResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to create schedule." })
  async createSchedule(
    @CurrentUser() user: UserEntity,
    @Body() input: CreateScheduleRequestDto
  ): Promise<GetScheduleResponseDto> {
    const command = new CreateScheduleCommand(
      user.id,
      input
    );

    const result = await this.commandBus.execute<
      CreateScheduleCommand, GetScheduleResponseDto
    >(command);

    return result;
  }

  @Post('/import-csv')
  @ApiOperation({ summary: "Import schedule from CSV file" })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: GetScheduleResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to import schedule." })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  async importSchedule(
    @CurrentUser() user: UserEntity,
    @Body() input: ImportScheduleFromCSVRequestDto
  ): Promise<GetScheduleResponseDto[]> {
    const command = new ImportScheduleFromCSVCommand(
      user.id,
      input
    );

    const result = await this.commandBus.execute<
      ImportScheduleFromCSVCommand, GetScheduleResponseDto[]
    >(command);

    return result;
  }

  @Put('/schedule/:scheduleId')
  @ApiOperation({ summary: "Update schedule" })
  @ApiParam({ name: 'scheduleId', description: "Schedule ID", type: String })
  @ApiResponse({
    status: 200,
    description: "Update schedule successfully.",
    type: UpdateOrDeleteResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to update schedule." })
  async updateSchedule(
    @CurrentUser() user: UserEntity,
    @Param('scheduleId') scheduleId: string,
    @Body() input: UpdateScheduleRequestDto
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new UpdateScheduleCommand(
      user.id,
      scheduleId,
      input
    );

    const result = await this.commandBus.execute<
      UpdateScheduleCommand, UpdateOrDeleteResponseDto
    >(command);

    return result;
  }

  @Delete('/schedule')
  @ApiOperation({ summary: "Delete list of schedules by Id" })
  @ApiResponse({
    status: 200,
    description: "Delete schedule successfully.",
    type: UpdateOrDeleteResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to delete schedule." })
  async deleteSchedule(
    @CurrentUser() user: UserEntity,
    @Body() input: DeleteScheduleRequestDto
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new DeleteScheduleCommand(
      user.id,
      input
    );

    const result = await this.commandBus.execute<
      DeleteScheduleCommand, UpdateOrDeleteResponseDto
    >(command);

    return result;
  }
}