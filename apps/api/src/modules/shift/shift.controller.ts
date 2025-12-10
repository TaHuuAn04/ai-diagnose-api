import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { CurrentUser } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { PageDto, PageOptionsDto } from "@app/core/dtos";

import { GetListShiftResponseDto } from "./dtos/response/shift.response.dto";
import { GetListShiftQuery } from "./use-cases/get-list-shift.use-case";

@ApiTags('shifts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller("shifts")
export class ShiftController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get list of shifts' })
  @ApiResponse({ status: 200, description: 'List of shifts retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getListShifts(
    @CurrentUser() user: UserEntity,
    @Query() pageOptions: PageOptionsDto
  ): Promise<PageDto<GetListShiftResponseDto>> {
    // Implementation will go here
    const query = new GetListShiftQuery(
      user.id,
      pageOptions
    );

    const result = await this.queryBus.execute<
      GetListShiftQuery,
      PageDto<GetListShiftResponseDto>
    >(query)

    return result;
  }

}