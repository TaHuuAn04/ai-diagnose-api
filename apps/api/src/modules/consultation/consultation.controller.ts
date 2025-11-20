import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
  
} from './dtos';

@ApiTags('Consulting')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('consultation')
export class ConsultingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  // @Post('book')
  // @ApiOperation({ summary: "API for booking an appointment for a patient" })
  // @ApiResponse({
  //   status: 200,
  //   description: "Appointment booked successfully.",
  //   schema: { example: { Status: true } }
  // })
  // @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  // @ApiResponse({
  //   status: 500,
  //   description: "An error occurred during processing or the appointment slot has already been taken",
  //   schema: { example: { Status: false } }
  // })
  // @ApiConsumes('multipart/form-data')
  // async bookAppointment(
  //   @CurrentUser() user: User,
  //   @Body() input: BookAppointmentDto,
  // ): Promise<true> {
  //     return await mockResult();
  //   }
  
}
