import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { IsPublic } from "@app/core/decorators";
import { PageDto, PageOptionsDto } from "@app/core/dtos";

import { GetListDoctorResponseDto } from "./dtos/response";
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
  @ApiOperation({ summary: 'Get list of doctors' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: 'number' })
  @ApiQuery({ name: 'take', required: false, description: 'Items per page', type: 'number' })
  @ApiResponse({ status: 200, description: 'List of doctors retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getListDoctors(
    @Query() pageOptions: PageOptionsDto
  ): Promise<PageDto<GetListDoctorResponseDto>> {
    const query = new GetListDoctorQuery(pageOptions);

    const result = await this.queryBus.execute<
      GetListDoctorQuery,
      PageDto<GetListDoctorResponseDto>
    >(query);

    return result;
  }
}
