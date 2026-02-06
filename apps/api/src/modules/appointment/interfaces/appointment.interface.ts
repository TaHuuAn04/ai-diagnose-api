import { PageDto } from "@app/core/dtos/page.dto";

import { GetAppointmentResponseDto, GetListAppointmentDto } from "../dtos";

export interface IAppointmentService {
  getListAppointment(
    userId: string,
    request: GetListAppointmentDto,
  ): Promise<PageDto<GetAppointmentResponseDto>>;
}
