import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";
import { FormDataRequest } from "nestjs-form-data";

import { CurrentUser, IsPublic, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { RolesGuard } from "@app/core/guards";

import { UpdateOrDeleteResponseDto } from "../../common/dtos";

import { CancelAppointmentPublicDto, GetAppointmentResponseDto, GetAppointmentsPublicDto, TakeNoteAppointmentDto, UpdateAppointmentDto } from "./dtos";
import { CancelAppointmentCommand, CancelAppointmentPublicCommand, GetAppointmentsPublicQuery, TakeNoteAppointmentCommand, UpdateAppointmentCommand } from "./use-cases";

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

  @Get('/public/:patientId')
  @IsPublic()
  @ApiOperation({ summary: "Get patient's appointments without auth (for chatbot)" })
  @ApiParam({ name: 'patientId', description: "User ID of the patient", type: String })
  @ApiResponse({ status: 200, description: "Appointments retrieved successfully.", type: [GetAppointmentResponseDto] })
  async getAppointmentsPublic(
    @Param('patientId') patientId: string,
    @Query() query: GetAppointmentsPublicDto,
  ): Promise<GetAppointmentResponseDto[]> {
    const q = new GetAppointmentsPublicQuery(patientId, query.status);

    const result = await this.queryBus.execute<
      GetAppointmentsPublicQuery, GetAppointmentResponseDto[]
    >(q);

    return result;
  }

  @Post('/cancel-public')
  @IsPublic()
  @ApiOperation({ summary: "Cancel an appointment via chatbot (no auth required)" })
  @ApiResponse({ status: 200, description: "Appointment cancelled successfully." })
  @ApiResponse({ status: 400, description: "Appointment cannot be cancelled." })
  @ApiResponse({ status: 403, description: "patientId does not match the appointment owner." })
  @ApiResponse({ status: 404, description: "Appointment not found." })
  async cancelAppointmentPublic(
    @Body() input: CancelAppointmentPublicDto,
  ): Promise<UpdateOrDeleteResponseDto> {
    const command = new CancelAppointmentPublicCommand(
      input.appointmentId,
      input.patientId
    );

    const result = await this.commandBus.execute<
      CancelAppointmentPublicCommand, UpdateOrDeleteResponseDto
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

