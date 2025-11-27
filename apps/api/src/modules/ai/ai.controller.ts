import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
    AIListDto,
    ChatQueryDto,
    ChatResponseDto,
    ChatResponseListInfo,
    ConsultationRequestDto,
    ConsultationResponseDto,
} from './dtos';

@ApiTags('AI')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('ai')
export class AIController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }
  
  @Get('list')
  @ApiOperation({ summary: "AI list will be listed in this feature" })
  @ApiQuery({ name: 'type', required: true, description: 'type of API to get list' })
  @ApiResponse({
    status: 200,
    description: "AI list retrived successfully.",
    type: AIListDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({
    status: 500,
    description: "An error occurred during processing to retrive the list of AI.",
  })
  async getList(
    @CurrentUser() user: User,
    @Query('type') type: string,
  ): Promise<AIListDto> {
      return await mockResult();
  }
  
  @Get('chatbot/history')
  @ApiOperation({ summary: "Query list of chatbot will be listed in this feature" })
  @ApiResponse({
    status: 200,
    description: "Chatbot query list retrived successfully.",
    type: ChatResponseListInfo
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({
    status: 500,
    description: "An error occurred during processing to retrive the list of chatbot query.",
  })
  async history(
    @CurrentUser() user: User,
  ): Promise<ChatResponseListInfo> {
      return await mockResult();
    }

  @Post('chatbot/chat')
  @ApiOperation({ summary: "Patient's conversation with the chatbot is processed here" })
  @ApiResponse({
    status: 200,
    description: "Chatbot processed the conversation successfully.",
    type: ChatResponseDto
  })
  @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
  @ApiResponse({
    status: 500,
    description: "An error occurred during processing and the chatbot could not provide an answer.",
  })
  async chat(
    @CurrentUser() user: User,
    @Body() input: ChatQueryDto,
  ): Promise<ChatResponseDto> {
      return await mockResult();
    }
  
  @Post('diagnosticAI/diagnose')
    @ApiOperation({ summary: "Logic handler for dermatology diagnosis" })
    @ApiResponse({
      status: 200,
      description: "AI analyzed and returned a diagnosis successfully.",
      type: ConsultationResponseDto
    })
    @ApiResponse({ status: 403, description: "User does not have permission to access the API." })
    @ApiResponse({
      status: 500,
      description: "An error occurred during processing or the AI model encountered an issue.",
    })
    @ApiConsumes('multipart/form-data')
    async diagnose(
      @CurrentUser() user: User,
      @Body() input: ConsultationRequestDto,
    ): Promise<ConsultationResponseDto> {
        return await mockResult();
  }
}
