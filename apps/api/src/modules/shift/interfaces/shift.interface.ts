import { PageDto, PageOptionsDto } from "@app/core/dtos";

import { BookShiftRequestDto } from "../dtos/requests/book-shift.request.dto";
import { AvailableShiftResponseDto } from "../dtos/response/available-shift.response.dto";
import { BookShiftResponseDto } from "../dtos/response/book-shift.response.dto";
import { GetListShiftResponseDto } from "../dtos/response/shift.response.dto";

export interface IShiftService {
  getListShifts(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<GetListShiftResponseDto>>;

  getAvailableShiftsByDoctor(
    doctorId: string,
    startDate?: string,
    endDate?: string,
    pageOptionsDto?: PageOptionsDto
  ): Promise<PageDto<AvailableShiftResponseDto>>;

  bookShift(
    bookShiftDto: BookShiftRequestDto
  ): Promise<BookShiftResponseDto>;
}