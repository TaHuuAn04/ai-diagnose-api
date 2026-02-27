import { Body, Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";
import { FormDataRequest } from "nestjs-form-data";

import { Roles } from "@app/core/decorators";
import { UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos";
import { RolesGuard } from "@app/core/guards";

import { UpdateOrDeleteResponseDto } from "../../common/dtos";

import { GetAppointmentResponseDto, GetListAppointmentDto, UpdateAppointmentDto } from "./dtos";
import { CancelAppointmentCommand, GetListAppointmentQuery, UpdateAppointmentCommand } from "./use-cases";

@ApiTags('Appointments')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@ApiBearerAuth('access-token')
@Controller("appointments")
export class AppointmentController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Get('/:userId')
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

  @Patch('/:appointmentId')
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: "Update an appointment" })
  @ApiParam({ name: 'appointmentId', description: "ID of the appointment to update", type: String })
  @ApiResponse({ status: 200, description: "Appointment updated successfully." })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to update the appointment." })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  async updateAppointment(
    @Param('appointmentId') appointmentId: string,
    @Body() input: UpdateAppointmentDto
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new UpdateAppointmentCommand(appointmentId, input);

    const result = await this.commandBus.execute<
      UpdateAppointmentCommand, UpdateOrDeleteResponseDto
      >(command);
    
    return result;
  }

  @Patch('/:appointmentId/cancel')
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: "Cancel an appointment" })
  @ApiParam({ name: 'appointmentId', description: "ID of the appointment to cancel", type: String })
  @ApiResponse({ status: 200, description: "Appointment cancelled successfully." })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to cancel the appointment." })
  async cancelAppointment(
    @Param('appointmentId') appointmentId: string,
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new CancelAppointmentCommand(appointmentId);

    const result = await this.commandBus.execute<
      CancelAppointmentCommand, UpdateOrDeleteResponseDto
      >(command);
    
    return result;
  }
}
