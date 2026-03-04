import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { IsPublic } from "@app/core/decorators";
import { PageDto } from "@app/core/dtos";

import { GetDoctorResponseDto, GetListDoctorRequestDto } from "./dtos";
import { GetDoctorInfoQuery, GetListDoctorQuery } from "./use-cases";

@ApiTags('Doctors')
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
  ): Promise<PageDto<GetDoctorResponseDto>> {
    const query = new GetListDoctorQuery(request);

    const result = await this.queryBus.execute<
      GetListDoctorQuery,
      PageDto<GetDoctorResponseDto>
    >(query);

    return result;
  }

  @Get('info/:doctorId')
  @IsPublic()
  @ApiOperation({ summary: 'Get doctor information by ID' })
  @ApiParam({ name: 'doctorId', type: 'string', description: 'ID of the doctor' })
  @ApiResponse({ status: 200, description: 'Doctor information retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getDoctorInfo(
    @Param('doctorId') doctorId: string
  ): Promise<GetDoctorResponseDto> {
    const query = new GetDoctorInfoQuery(doctorId);

    const result = await this.queryBus.execute<
      GetDoctorInfoQuery,
      GetDoctorResponseDto
    >(query);

    return result;
  }

}
