import { Controller, Get, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { CurrentUser, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
// import { PageDto, PageOptionsDto } from "@app/core/dtos";
import { UserRole } from "@app/core/domain/enums";

import { PatientInfoDto } from "./dtos";
import { GetInfoQuery } from "./use-cases";


@ApiTags('patients')
@Roles(UserRole.PATIENT)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller("patients")
export class PatientController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @ApiOperation({ summary: "Get patient's personal information" })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: PatientInfoDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse( { status: 500, description: "An error occurred during processing; failed to retrieve information."})
  async getInfo(
    @CurrentUser() user: UserEntity,
  ): Promise<PatientInfoDto> {
    // Implementation will go here

    const query = new GetInfoQuery(
      user.id
    );

    const result = await this.queryBus.execute<
      GetInfoQuery, PatientInfoDto
    >(query)

    return result;
  }
}