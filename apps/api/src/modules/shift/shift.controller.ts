import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { CurrentUser, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { PageDto, PageOptionsDto } from "@app/core/dtos";
import { RolesGuard } from "@app/core/guards";

import { GetListShiftResponseDto } from "./dtos/response/shift.response.dto";
import { GetListShiftQuery } from "./use-cases/get-list-shift.use-case";

@ApiTags('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DOCTOR)
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
    @Query() pageOptions: PageOptionsDto
  ): Promise<PageDto<GetListShiftResponseDto>> {
    // Implementation will go here
    const query = new GetListShiftQuery(
      pageOptions
    );

    const result = await this.queryBus.execute<
      GetListShiftQuery,
      PageDto<GetListShiftResponseDto>
    >(query)

    return result;
  }


  @Get(':doctorId')
  @ApiOperation({ summary: 'Get list of shifts for a specific doctor' })
  @ApiResponse({ status: 200, description: 'List of shifts for the doctor retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getListShiftsForDoctor(
    @CurrentUser() user: UserEntity,
    @Query() pageOptions: PageOptionsDto
  ): Promise<GetListShiftResponseDto[]> {
    const query = new GetListShiftQuery(
      pageOptions
    );

    const result = await this.queryBus.execute<
      GetListShiftQuery,
      PageDto<GetListShiftResponseDto>
    >(query);

    return result.data;
  }
}