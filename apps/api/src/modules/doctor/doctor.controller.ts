import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { IsPublic } from "@app/core/decorators";
import { PageDto } from "@app/core/dtos";

import { GetListDoctorRequestDto, GetListDoctorResponseDto } from "./dtos";
import { GetListDoctorQuery } from "./use-cases/get-list-doctor.use-case";

@ApiTags('doctors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller("doctors")
export class DoctorController {
  constructor(
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @IsPublic()
  @ApiOperation({ summary: 'Get list of doctors with optional filters' })
  @ApiResponse({ status: 200, description: 'List of doctors retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getListDoctors(
    @Query() request: GetListDoctorRequestDto
  ): Promise<PageDto<GetListDoctorResponseDto>> {
    const query = new GetListDoctorQuery(request);

    const result = await this.queryBus.execute<
      GetListDoctorQuery,
      PageDto<GetListDoctorResponseDto>
    >(query);

    return result;
  }
}
