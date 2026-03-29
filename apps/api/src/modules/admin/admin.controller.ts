import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/guards';

import { RolesGuard } from '@app/core';
import { Roles } from '@app/core/decorators';
import { UserRole } from '@app/core/domain/enums';

import {
  CreateAdmissionStaffAccountRequestDto,
  CreateAdmissionStaffAccountResponseDto,
  CreateDoctorAccountRequestDto,
  CreateDoctorAccountResponseDto,
} from './dtos';
import {
  CreateAdmissionStaffAccountCommand,
  CreateDoctorAccountCommand,
} from './use-cases';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('doctors')
  @ApiOperation({ summary: 'Create a doctor account (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Doctor account created successfully',
    type: CreateDoctorAccountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request / Duplicate data' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async createDoctorAccount(
    @Body() request: CreateDoctorAccountRequestDto,
  ): Promise<CreateDoctorAccountResponseDto> {
    const command = new CreateDoctorAccountCommand(request);
    
    return this.commandBus.execute<
      CreateDoctorAccountCommand,
      CreateDoctorAccountResponseDto
    >(command);
  }

  @Post('staffs')
  @ApiOperation({ summary: 'Create an admission staff account (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Admission staff account created successfully',
    type: CreateAdmissionStaffAccountResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request / Duplicate data' })
  @ApiResponse({ status: 403, description: 'Forbidden resource' })
  async createAdmissionStaffAccount(
    @Body() request: CreateAdmissionStaffAccountRequestDto,
  ): Promise<CreateAdmissionStaffAccountResponseDto> {
    const command = new CreateAdmissionStaffAccountCommand(request);
    
    return this.commandBus.execute<
      CreateAdmissionStaffAccountCommand,
      CreateAdmissionStaffAccountResponseDto
    >(command);
  }
}
