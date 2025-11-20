import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

// import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '@api/guards';

// import {  } from '@app/core/domain/entities';

import { SortDirection } from '@app/core/domain/enums';

async function mockResult<T = true>(result: T = true as unknown as T, delayMs = 150): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return result;
}

import { AppointmentListInfo } from '../appointment/dtos';
import { ListScheduleInfo, ShiftListInfo } from '../schedule/dtos';

import {
    RebookingAppointmentDto,
    ScheduleFileRequestDto,
    ShiftSettingDto,
} from './dtos';


@ApiTags('Admission Staff')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('admission-staff')
export class AdmissionStaffController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('list-appointment-all')
  @ApiOperation({ summary: "Summarize patient appointment registrations" })
  @ApiQuery({ name: 'date', required: false, description: 'Date to filter by' })  
  @ApiQuery({ name: 'search', required: false, description: 'Search keyword' })
  @ApiQuery({ name: 'sortColumn', required: false, description: 'Sort column' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order (asc|desc)' })
  @ApiResponse({
      status: 200,
      description: "Information retrieved successfully.",
      type: AppointmentListInfo
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse( { status: 500, description: "An error occurred during processing; failed to retrieve information."})
  async getInfo(
      @Query('date') date?: Date,
      @Query('search') search?: string,
      @Query('sortColumn') sortColumn?: string,
      @Query('sortOrder') sortOrder?: SortDirection
  ): Promise<AppointmentListInfo> {
        return await mockResult();
    }
    
  @Post('rebooking-appointment')
  @ApiOperation({ summary: "Reschedule a patient's appointment" })
  @ApiResponse({
    status: 200,
    description: "Appointment rescheduled successfully.",
    schema: { example: { Status: true } }
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({
    status: 500,
    description: "An error occurred during processing or the appointment slot has already been taken.",
    schema: { example: { Status: false } }
  })
  async rebookingAppointment(
    @Body() input: RebookingAppointmentDto,
  ): Promise<true> {
      return await mockResult();
    }

  @Post('upload-schedule')
  @ApiOperation({ summary: "Admission staff uploads doctors' work schedules to the system" })
  @ApiResponse({
    status: 200,
    description: "Appointment schedule uploaded to the system.", 
    type: ListScheduleInfo
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({
    status: 500,
    description: "An error occurred during processing; failed to upload the schedule.",
  })
  @ApiConsumes('multipart/form-data')
  async uploadSchedule(
    @Body() input: ScheduleFileRequestDto,
  ): Promise<ListScheduleInfo> {
      return await mockResult();
  }
  
  @Post('shift-setting')
  @ApiOperation({ summary: "Admission staff use the feature to break down work shifts" })
  @ApiResponse({
    status: 200,
    description: "Shifts were divided in the system.", 
    type: ShiftListInfo
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({
    status: 500,
    description: "An error occurred during processing; failed to divide schedule into shifts.",
  })
  async uploadShift(
    @Body() input: ShiftSettingDto,
  ): Promise<ListScheduleInfo> {
      return await mockResult();
  }
  
}
