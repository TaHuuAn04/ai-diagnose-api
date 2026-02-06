import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { Roles } from "@app/core/decorators";
import { UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos";
import { RolesGuard } from "@app/core/guards";

import { GetAppointmentResponseDto, GetListAppointmentDto } from "./dtos";
import { GetListAppointmentQuery } from "./use-cases";

@ApiTags('Appointments')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@ApiBearerAuth('access-token')
@Controller("appointments")
export class AppointmentController {
  constructor(
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @Roles(UserRole.PATIENT, UserRole.STAFF)
  @ApiOperation({ summary: "Get list of patient's appointments" })
  @ApiParam({ name: 'userId', description: "ID of the patient (user)", type: String })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: PageDto<GetAppointmentResponseDto>
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getAppointments(
    @Param('userId') userId: string,
    @Query() request: GetListAppointmentDto,
  ): Promise<PageDto<GetAppointmentResponseDto>> {
    const query = new GetListAppointmentQuery(userId, request);

    const result = await this.queryBus.execute<
      GetListAppointmentQuery, PageDto<GetAppointmentResponseDto>
    >(query);

    return result;
  }
}
