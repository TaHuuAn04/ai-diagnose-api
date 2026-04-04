import { Body, Controller, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { CurrentUser, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos";
import { RolesGuard } from "@app/core/guards";

import { GetTodayAppointmentsResponseDto, GetTodayAppointmentsRequestDto, GetActiveDoctorsResponseDto } from "./dtos";
import { GetActiveDoctorsQuery, GetTodayAppointmentsQuery } from "./use-cases";


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
}