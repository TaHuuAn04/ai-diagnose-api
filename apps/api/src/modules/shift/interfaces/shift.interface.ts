import { PageDto, PageOptionsDto } from "@app/core/dtos";

import { GetListShiftResponseDto } from "../dtos/response/shift.response.dto";

export interface IShiftService {
  getListShifts(
    userId: string,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<GetListShiftResponseDto>>;
}