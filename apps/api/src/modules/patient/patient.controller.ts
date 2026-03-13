import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "@api/guards";

import { CurrentUser, Roles } from "@app/core/decorators";
import { UserEntity } from "@app/core/domain/entities";
import { UserRole } from "@app/core/domain/enums";
import { RolesGuard } from "@app/core/guards";

import { PatientInfoDto, UpdatePatientDto } from "./dtos";
import { GetInfoQuery, UpdatePatientCommand } from "./use-cases";


@ApiTags('Patients')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@Roles(UserRole.PATIENT)
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

  //TODO: Uncomment and implement when medical records feature is ready
  // @Get('medical-records')
  // @ApiQuery({ name: 'sort', required: false, description: 'Field to sort by', type: 'string' })
  // @ApiQuery({ name: 'sortDirection', required: false, description: 'Sort direction (ASC or DESC)', type: 'enum', enum: SortDirection })
  // @ApiQuery({ name: 'page', description: 'Page number', type: 'number' })
  // @ApiQuery({ name: 'take', description: 'Items per page', type: 'number' })
  // @ApiQuery({ name: 'keyword', required: false, description: 'Keyword to filter medical records', type: 'string' })
  // @ApiOperation({ summary: "Get list of patient's medical records" })
  // @ApiResponse({
  //   status: 200,
  //   description: "Information retrieved successfully.",
  //   type: PageDto<MedicalRecordsDto>
  // })
  // @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  // @ApiResponse( { status: 500, description: "An error occurred during processing; failed to retrieve information."})
  // async getMedicalRecords(
  //   @CurrentUser() user: UserEntity,
  //   @Query() pageOptions: PageOptionsDto
  // ): Promise<PageDto<MedicalRecordsDto>> {
  //   // Implementation will go here

  //   const query = new GetMedicalRecordsQuery(
  //     user.id, 
  //     pageOptions
  //   );

  //   const result = await this.queryBus.execute<
  //     GetMedicalRecordsQuery, PageDto<MedicalRecordsDto>
  //   >(query)

  //   return result;
  // }
  

  @Put()
  @ApiOperation({ summary: "Personal profile update feature" })
  @ApiResponse({
      status: 200,
      description: "Personal profile updated successfully.",
      type: PatientInfoDto
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse( { status: 500, description: "An error occurred during processing; failed to update information."})
  async update(
    @CurrentUser() user: UserEntity,
    @Body() input: UpdatePatientDto,
  ): Promise<PatientInfoDto> {
    // Implementation will go here
    const command = new UpdatePatientCommand(
      user.id,
      input
    );

    const result = await this.commandBus.execute <
      UpdatePatientCommand, PatientInfoDto
    >(command)
    
    return result;
  }
}