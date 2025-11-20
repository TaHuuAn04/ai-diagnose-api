import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '@api/guards';

// import {  } from '@app/core/domain/entities';

async function mockResult<T = true>(result: T = true as unknown as T, delayMs = 150): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return result;
}

import {
  ModelRequestDto,
  PrivilegeRequestDto,
  PrivilegeResponseDto
} from './dtos'

@ApiTags('Admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(  
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

    @Post('upload-model')
    @ApiOperation({ summary: "Admin uploads a new model to the system" })
    @ApiResponse({
      status: 200,
      description: "AI or Chatbot model updated successfully.", 
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse({
      status: 500,
      description: "An error occurred during processing.",
    })
    async uploadModel(
      @Body() input: ModelRequestDto,
    ): Promise<null> {
        return await mockResult();
    }
    
    @Post('create-account')
    @ApiOperation({ summary: "Admin registers accounts for reception staff and doctors" })
    @ApiResponse({
        status: 200,
        description: "Registration successful", 
        type: PrivilegeResponseDto
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse({
      status: 500,
      description: "An error occurred during processing or failed to register the account.",
    })
    async createAccount(
      @Body() input: PrivilegeRequestDto,
    ): Promise<PrivilegeResponseDto> {
        return await mockResult();
    }
    
}
