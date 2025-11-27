import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

// import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '@api/guards';

import { CurrentUser } from '@app/core/decorators';

import { User } from '../../infrastructure/database/typeorm-nest/entities';
// import {  } from '@app/core/domain/entities';

async function mockResult<T = true>(result: T = true as unknown as T, delayMs = 150): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return result;
}

import {
    DiseaseInfoDto,
    DiseaseRequestDto,
    UpdateDiseaseDto,
} from './dtos'

@ApiTags('Disease')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('disease')
export class DiseaseController {
  constructor(  
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  
  @Get()
  @ApiOperation({ summary: "API returns disease information" })
  @ApiQuery({ name: 'name', required: true, description: 'Name of disease' }) 
  @ApiResponse({
      status: 200,
      description: "Information retrieved successfully.",
      type: DiseaseInfoDto
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse( { status: 500, description: "An error occurred during processing; failed to retrieve information."})
  async get(
      @CurrentUser() user: User,
      @Query() name: string,
  ): Promise<DiseaseInfoDto> {
        return await mockResult();
    }
    
  @Put()
  @ApiOperation({ summary: "Update disease information" })
  @ApiResponse({
      status: 200,
      description: "Disease updated successfully.",
      type: DiseaseInfoDto
    })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to update information." })
  @ApiConsumes('multipart/form-data')
  async update(
      @CurrentUser() user: User,
      @Body() input: UpdateDiseaseDto,
  ): Promise<DiseaseInfoDto> {
        return await mockResult();
    }

  @Post()
  @ApiOperation({ summary: "Update new disease" })
  @ApiResponse({
      status: 200,
      description: "Disease added successfully",
      type: DiseaseInfoDto
    })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({ status: 500, description: "An error occurred during processing; failed to add information." })
  @ApiConsumes('multipart/form-data')
  async getInfo(
      @CurrentUser() user: User,
      @Body() input: DiseaseRequestDto,
  ): Promise<DiseaseInfoDto> {
        return await mockResult();
    }
}
