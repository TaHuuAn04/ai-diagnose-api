import { Controller, Get, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
    ShiftListInfo
} from './dtos';

@ApiTags('Doctor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

    @Get('list-shift')
    @ApiOperation({ summary: "Doctors can use this feature to view appointments registered for the day." })
    @ApiResponse({
        status: 200,
        description: "Appointments registered by patients with the doctor.",
        type: ShiftListInfo
      })
      @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
      @ApiResponse( { status: 500, description: "An error occurred during processing; failed to display the schedule."})
    async getInfo(
        @CurrentUser() user: User
    ): Promise<ShiftListInfo> {
          return await mockResult();
    }
}
