import { PageDto } from "@app/core/dtos/page.dto";

import { UpdateOrDeleteResponseDto } from "../../../common/dtos";
import { GetAppointmentResponseDto, GetListAppointmentDto, UpdateAppointmentDto } from "../dtos";

export interface IAppointmentService {
  getListAppointment(
    userId: string,
    request: GetListAppointmentDto,
  ): Promise<PageDto<GetAppointmentResponseDto>>;

  cancelAppointment(appointmentId: string): Promise<UpdateOrDeleteResponseDto>; 

  updateAppointment(
    appointmentId: string,
    input: UpdateAppointmentDto
  ): Promise<UpdateOrDeleteResponseDto>;
}
