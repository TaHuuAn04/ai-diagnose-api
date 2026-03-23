import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";
import { FormDataRequest } from "nestjs-form-data";

import { Roles } from "@app/core/decorators";
import { UserRole } from "@app/core/domain/enums";
import { RolesGuard } from "@app/core/guards";

import { UpdateOrDeleteResponseDto } from "../../common/dtos";

import { UpdateAppointmentDto } from "./dtos";
import { CancelAppointmentCommand, UpdateAppointmentCommand } from "./use-cases";

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
