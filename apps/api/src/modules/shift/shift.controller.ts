import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";
import { FormDataRequest } from "nestjs-form-data";

import { IsPublic } from "@app/core/decorators";
import { PageDto, PageOptionsDto } from "@app/core/dtos";

import { BookShiftRequestDto } from "./dtos/requests/book-shift.request.dto";
import { AvailableShiftResponseDto } from "./dtos/response/available-shift.response.dto";
import { BookShiftResponseDto } from "./dtos/response/book-shift.response.dto";
import { GetListShiftResponseDto } from "./dtos/response/shift.response.dto";
import { BookShiftCommand } from "./use-cases/book-shift.use-case";
import { GetAvailableShiftsByDoctorQuery } from "./use-cases/get-available-shifts-by-doctor.use-case";
import { GetListShiftQuery } from "./use-cases/get-list-shift.use-case";

@ApiTags('shifts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller("shifts")
export class ShiftController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Get list of shifts' })
  @ApiResponse({ status: 200, description: 'List of shifts retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getListShifts(
    @Query() pageOptions: PageOptionsDto
  ): Promise<PageDto<GetListShiftResponseDto>> {
    // Implementation will go here
    const query = new GetListShiftQuery(
      pageOptions
    );

    const result = await this.queryBus.execute<
      GetListShiftQuery,
      PageDto<GetListShiftResponseDto>
    >(query)

    return result;
  }


  @Get('available/:doctorId')
  @IsPublic()
  @ApiOperation({ summary: 'Get available shifts for a specific doctor' })
  @ApiParam({ name: 'doctorId', description: 'Doctor ID', type: 'string' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: 'number' })
  @ApiQuery({ name: 'take', required: false, description: 'Items per page', type: 'number' })
  @ApiResponse({ status: 200, description: 'Available shifts retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAvailableShiftsByDoctor(
    @Param('doctorId') doctorId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query() pageOptions?: PageOptionsDto
  ): Promise<PageDto<AvailableShiftResponseDto>> {
    const query = new GetAvailableShiftsByDoctorQuery(
      doctorId,
      startDate,
      endDate,
      pageOptions
    );

    const result = await this.queryBus.execute<
      GetAvailableShiftsByDoctorQuery,
      PageDto<AvailableShiftResponseDto>
    >(query);

    return result;
  }

  @Post('book')
  @IsPublic()
  @ApiOperation({ summary: 'Book an appointment for a shift' })
  @ApiResponse({ status: 201, description: 'Appointment booked successfully.' })
  @ApiResponse({ status: 400, description: 'Shift not available or invalid request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  async bookShift(
    @Body() bookShiftDto: BookShiftRequestDto
  ): Promise<BookShiftResponseDto> {
    const command = new BookShiftCommand(bookShiftDto);

    const result = await this.commandBus.execute<
      BookShiftCommand,
      BookShiftResponseDto
    >(command);

    return result;
  }
}