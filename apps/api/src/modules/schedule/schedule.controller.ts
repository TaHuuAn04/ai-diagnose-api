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
  ListScheduleInfo,
  ShiftBookingListInfo,
} from './dtos'

@ApiTags('Schedule')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('schedule')
export class ScheduleController {
  constructor(  
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  
  @Get()
  @ApiOperation({ summary: "API returns schedule information" })
  @ApiResponse({
      status: 200,
      description: "Information retrieved successfully.",
      type: ListScheduleInfo
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse( { status: 500, description: "An error occurred during processing; failed to retrieve information."})
  async getInfo(
      @CurrentUser() user: User,
  ): Promise<ListScheduleInfo> {
        return await mockResult();
    }
    
  
  @Get('shift-book')
  @ApiOperation({ summary: "Shift infomation to booking" })
  @ApiResponse({
      status: 200,
      description: "Information retrieved successfully.",
      type: ShiftBookingListInfo
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse( { status: 500, description: "An error occurred during processing; failed to retrieve information."})
  async getShiftInfo(
      @CurrentUser() user: User,
  ): Promise<ShiftBookingListInfo> {
        return await mockResult();
    }
}
