import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";
import { FormDataRequest } from "nestjs-form-data";

import { IsPublic } from "@app/core/decorators";
import { PageDto, PageOptionsDto } from "@app/core/dtos";

import { BookShiftRequestDto } from "./dtos/requests/book-shift.request.dto";
import { GetShiftsByDoctorIdRequestDto } from "./dtos/requests/get-available-shifts.request.dto";
import { AvailableShiftResponseDto } from "./dtos/response/available-shift.response.dto";
import { BookShiftResponseDto } from "./dtos/response/book-shift.response.dto";
import { GetListShiftResponseDto } from "./dtos/response/shift.response.dto";
import { BookShiftCommand } from "./use-cases/book-shift.use-case";
import { GetShiftsByDoctorQuery } from "./use-cases/get-available-shifts-by-doctor.use-case";
import { GetListShiftQuery } from "./use-cases/get-list-shift.use-case";

@ApiTags('Shifts')
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
  ): Promise<GetListShiftResponseDto[]> {
    // Implementation will go here
    const query = new GetListShiftQuery();

    const result = await this.queryBus.execute<
      GetListShiftQuery,
      GetListShiftResponseDto[]
    >(query)

    return result;
  }


  @Get('/:doctorId')
  @IsPublic()
  @ApiOperation({ summary: 'Get shifts for a specific doctor' })
  @ApiParam({ name: 'doctorId', description: 'Doctor ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Available shifts retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getShiftsByDoctor(
    @Param('doctorId') doctorId: string,
    @Query() input: GetShiftsByDoctorIdRequestDto
  ): Promise<AvailableShiftResponseDto[]> {
    const query = new GetShiftsByDoctorQuery(
      doctorId,
      input
    );

    const result = await this.queryBus.execute<
      GetShiftsByDoctorQuery,
      AvailableShiftResponseDto[]
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