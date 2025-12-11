import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { PageDto, PageOptionsDto } from "@app/core/dtos";

import { GetListShiftResponseDto } from "../dtos/response";
import { IShiftService } from "../interfaces";

export class GetListShiftQuery {
  constructor(
    public readonly pageOptionsDto: PageOptionsDto
  ) {}
}

@QueryHandler(GetListShiftQuery)
export class GetListShiftQueryHandler 
  implements IQueryHandler<GetListShiftQuery, PageDto<GetListShiftResponseDto>> 
{
  constructor(
    @Inject(INJECTION_TOKEN.SHIFT_SERVICE)
    private readonly shiftService: IShiftService
  ) {}

  async execute(query: GetListShiftQuery): Promise<PageDto<GetListShiftResponseDto>> {
    // Implement the logic to get the list of shifts for the user
    const shifts = await this.shiftService.getListShifts(
      query.pageOptionsDto
    );

    return shifts;
  }
}