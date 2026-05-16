import { Body, Controller, Param, Patch, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";
import { FormDataRequest } from "nestjs-form-data";

import { CurrentUser, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { RolesGuard } from "@app/core/guards";

import { UpdateOrDeleteResponseDto } from "../../common/dtos";

import { TakeNoteAppointmentDto, UpdateAppointmentDto } from "./dtos";
import { CancelAppointmentCommand, TakeNoteAppointmentCommand, UpdateAppointmentCommand } from "./use-cases";

@ApiTags('Appointments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller("appointments")
export class AppointmentController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Patch('/:appointmentId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PATIENT)
  @ApiOperation({ summary: "Update an appointment" })
  @ApiParam({ name: 'appointmentId', description: "ID of the appointment to update", type: String })
  @ApiResponse({ status: 200, description: "Appointment updated successfully." })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to update the appointment." })
  @ApiConsumes('multipart/form-data')
  @FormDataRequest()
  async updateAppointment(
    @CurrentUser() user: UserEntity,
    @Param('appointmentId') appointmentId: string,
    @Body() input: UpdateAppointmentDto
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new UpdateAppointmentCommand(user.id, appointmentId, input);

    const result = await this.commandBus.execute<
      UpdateAppointmentCommand, UpdateOrDeleteResponseDto
      >(command);
    
    return result;
  }

  @Patch('/:appointmentId/cancel')
  @ApiOperation({ summary: "Cancel an appointment" })
  @ApiParam({ name: 'appointmentId', description: "ID of the appointment to cancel", type: String })
  @ApiResponse({ status: 200, description: "Appointment cancelled successfully." })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to cancel the appointment." })
  async cancelAppointment(
    @CurrentUser() user: UserEntity,
    @Param('appointmentId') appointmentId: string,
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new CancelAppointmentCommand(user.id, user.role, appointmentId);

    const result = await this.commandBus.execute<
      CancelAppointmentCommand, UpdateOrDeleteResponseDto
      >(command);
    
    return result;
  }

  @Patch('/:appointmentId/note')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: "Update note for staff with appointment" })
  @ApiParam({ name: 'appointmentId', description: "ID of the appointment to update note", type: String })
  @ApiResponse({ status: 200, description: "Note of appointment taken successfully." })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to take note of the appointment." })
  async takeNoteAppointment(
    @CurrentUser() user: UserEntity,
    @Param('appointmentId') appointmentId: string,
    @Body() input: TakeNoteAppointmentDto
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new TakeNoteAppointmentCommand(user.id, appointmentId, input);

    const result = await this.commandBus.execute<
      TakeNoteAppointmentCommand, UpdateOrDeleteResponseDto
      >(command);
    
    return result;
  }
}

