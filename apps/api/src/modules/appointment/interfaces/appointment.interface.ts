import { AppointmentStatus, UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos/page.dto";

import { UpdateOrDeleteResponseDto } from "../../../common/dtos";
import { GetAppointmentResponseDto, GetListAppointmentDto, TakeNoteAppointmentDto, UpdateAppointmentDto } from "../dtos";

export interface IAppointmentService {
  getListAppointment(
    userId: string,
    request: GetListAppointmentDto,
  ): Promise<PageDto<GetAppointmentResponseDto>>;

  getUpcomingAppointment(userId: string): Promise<GetAppointmentResponseDto | null>;

  cancelAppointment(
    userId: string,
    role: UserRole,
    appointmentId: string
  ): Promise<UpdateOrDeleteResponseDto>;

  cancelAppointmentPublic(
    appointmentId: string,
    patientId: string
  ): Promise<UpdateOrDeleteResponseDto>;

  getAppointmentsPublic(
    userId: string,
    status?: AppointmentStatus,
  ): Promise<GetAppointmentResponseDto[]>;

  updateAppointment(
    userId: string,
    appointmentId: string,
    input: UpdateAppointmentDto
  ): Promise<UpdateOrDeleteResponseDto>;

  takeNoteAppointment(
    userId: string,
    appointmentId: string,
    input: TakeNoteAppointmentDto
  ): Promise<UpdateOrDeleteResponseDto>;
}
