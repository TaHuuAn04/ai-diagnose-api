import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  MedicalRecordInfoDto
} from './dtos';

@ApiTags('Consultation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('consultation')
export class ConsultingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('medical-record-detail/{id}')
  @ApiOperation({ summary: "API to view detailed patient medical history" })
  @ApiResponse({
    status: 200,
    description: "Medical record get successfully.",
    type: MedicalRecordInfoDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({
    status: 500,
    description: "An error occurred during processing to get data",
  })
  @ApiConsumes('multipart/form-data')
  async getMedicalRecordDetail(
    @CurrentUser() user: User,
    @Param('id') id: string
  ): Promise<MedicalRecordInfoDto> {
      return await mockResult();
    }
  
}
