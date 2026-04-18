import { Body, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { CurrentUser, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { PageDto } from "@app/core/dtos";
import { RolesGuard } from "@app/core/guards";


import { GetConsultationHistoryDto, GetConsultationResponseDto, GetMonthlyDiseasesRequestDto, GetMonthlyDiseasesResponseDto } from "./dtos";
import { GetConsultationHistoryQuery, GetStatisticDiseaseQuery } from "./use-cases";

@ApiTags('Consultations')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@ApiBearerAuth('access-token')
@Controller("consultations")
export class ConsultationController {
  constructor(
    private readonly queryBus: QueryBus,
  ) { }

  @Get('/:patientId/history')
  @Roles(UserRole.PATIENT, UserRole.DOCTOR)
  @ApiOperation({ summary: "Get consultation history of a patient" })
  @ApiParam({ name: 'patientId', description: "ID of the patient to get consultation history", type: String })
  @ApiResponse({
    status: 200,
    description: "Consultation history retrieved successfully.",
    type: PageDto<GetConsultationResponseDto>
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve consultation history." })
  async getConsultationHistory(
    @Param('patientId') patientId: string,
    @Query() request: GetConsultationHistoryDto,
  ): Promise<PageDto<GetConsultationResponseDto>> {
    const query = new GetConsultationHistoryQuery(patientId, request);

    const result = await this.queryBus.execute<
      GetConsultationHistoryQuery, PageDto<GetConsultationResponseDto>
    >(query);
    
    return result; 
  }

  @Get('/statistic-monthly-disease')
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: "Get statistic disease of request month for doctor" })
  @ApiResponse({
    status: 200,
    description: "Statistic disease retrieved successfully.",
    type: GetMonthlyDiseasesResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve statistic disease." })
  async getStatisticDisease(
    @CurrentUser() user: UserEntity,
    @Query() request: GetMonthlyDiseasesRequestDto
  ): Promise<GetMonthlyDiseasesResponseDto[]> {
    const query = new GetStatisticDiseaseQuery(user.id, request);

    const result = await this.queryBus.execute<
      GetStatisticDiseaseQuery, GetMonthlyDiseasesResponseDto[]
    >(query);
    
    return result; 
  }
}
