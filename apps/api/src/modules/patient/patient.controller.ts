import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '@api/guards';

import { CurrentUser } from '@app/core/decorators';

import { User } from '../../infrastructure/database/typeorm-nest/entities';
import { AppointmentListInfo } from '../appointment/dtos';

// import {  } from '@app/core/domain/entities';

async function mockResult<T = true>(result: T = true as unknown as T, delayMs = 150): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return result;
}

import {
    MedicalRecords,
    PatientAvatarDto,
    PatientInfoDto,
    PatientUpdateDto,
} from './dtos';

@ApiTags('Patient')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('patient')
export class PatientController {
  constructor(  
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  
  @Get('{id}')
  @ApiOperation({ summary: "API returns patient's personal information" })
  @ApiResponse({
      status: 200,
      description: "Information retrieved successfully.",
      type: PatientInfoDto
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse( { status: 500, description: "An error occurred during processing; failed to retrieve information."})
  async getInfo(
      @CurrentUser() user: User,
      @Param('id') id: string
  ): Promise<PatientInfoDto> {
        return await mockResult();
    }
    
    @Put()
    @ApiOperation({ summary: "Implement personal profile update feature" })
    @ApiResponse({
        status: 200,
        description: "Personal profile updated successfully.",
        type: PatientInfoDto
      })
      @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
      @ApiResponse( { status: 500, description: "An error occurred during processing; failed to update information."})
    async update(
      @CurrentUser() user: User,
      @Body() input: PatientUpdateDto
    ): Promise<PatientInfoDto> {
          return await mockResult();
  }
  
    @Post('avatar')
    @ApiOperation({ summary: "Implement personal avatar update feature" })
    @ApiResponse({
        status: 200,
        description: "Personal profile updated successfully.",
        type: PatientInfoDto
      })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse({ status: 500, description: "An error occurred during processing; failed to update information." })
    @ApiConsumes('multipart/form-data')
    async updateAvatar(
      @CurrentUser() user: User,
      @Body() input: PatientAvatarDto
    ): Promise<PatientInfoDto> {
          return await mockResult();
  }

    @Get('medical-history/{id}')
    @ApiOperation({ summary: "Retrieve patient's medical history" })
    @ApiResponse({
      status: 200,
      description: "Information retrieved successfully.",
      type: MedicalRecords
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse( { status: 500, description: "An error occurred during processing; failed to retrieve information."})
    async getMedicalRecords(
        @CurrentUser() user: User,
        @Param('id') id: string
    ): Promise<MedicalRecords> {
      return await mockResult();
  }
  
  @Get('list-appointment')
  @ApiOperation({ summary: "Retrieve patient's list of appointments" })
  @ApiResponse({
    status: 200,
    description: "Information retrieved successfully.",
    type: AppointmentListInfo
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to retrieve information." })
  async getListApointment(
    @CurrentUser() user: User,
  ): Promise<AppointmentListInfo> {
    return await mockResult();
  }

}