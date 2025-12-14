import { Readable } from 'stream';

import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/guards';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';

import { ApiResponseWrapper, CurrentUser, IsPublic } from '@app/core/decorators';
import { UserEntity } from '@app/core/domain/entities';
import { PageDto, PageMetaDto, PaginatedResult } from '@app/core/dtos';
import { DIFY_AI_APP_ID } from '@app/core/environments';

import {
  ChatMessageBlockBodyDto,
  ChatMessageBlockResponseDto,
  ChatMessageStreamBodyDto,
  EmbeddedChatConversationItemDto,
  EmbeddedChatMessageItemDto,
  GetEmbeddedChatConversationQueryDto,
  GetEmbeddedChatMessagesByConversationIdQueryDto,
  GetPassportResponseDto,
} from './dtos';
import {
  ChatMessageBlockCommand,
  ChatMessageStreamCommand,
  GetEmbeddedChatConversationQuery,
  GetEmbeddedChatMessagesByConversationIdQuery,
  GetEmbeddedChatPassportCommand,
} from './use-cases';

@UseGuards(JwtAuthGuard)
@ApiTags('Embedded Chat')
@Controller('embedded-chat')
export class EmbeddedChatController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('chat-messages-block')
  async chatMessageBlock(
    @Body() dto: ChatMessageBlockBodyDto,
    @Headers('Authorization') authorization: string,
  ): Promise<ChatMessageBlockResponseDto> {
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization.split(' ')[1];
    return this.commandBus.execute(
      new ChatMessageBlockCommand({
        token,
        ...dto,
      }),
    );
  }

  @IsPublic()
  @Post('chat-messages-stream')
  async chatMessageStream(
    @Body() dto: ChatMessageStreamBodyDto,
    @Headers('Authorization') authorization: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization.split(' ')[1];

    const result = await this.commandBus.execute<
      ChatMessageStreamCommand,
      Readable
    >(
      new ChatMessageStreamCommand({
        token,
        ...dto,
      }),
    );

    // Set the appropriate headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    result.pipe(res);

    result.on('end', () => {
      res.end();
    });
  }

  @IsPublic()
  @Get('conversations')
  @ApiResponseWrapper(EmbeddedChatConversationItemDto, 'Get conversations')
  async getConversations(
    @Headers('Authorization') authorization: string,
    @Query() dto: GetEmbeddedChatConversationQueryDto,
  ): Promise<PageDto<EmbeddedChatConversationItemDto>> {
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization.split(' ')[1];

    const result = await this.queryBus.execute<
      GetEmbeddedChatConversationQuery,
      PaginatedResult<EmbeddedChatConversationItemDto>
    >(
      new GetEmbeddedChatConversationQuery({
        ...dto,
        token,
      }),
    );

    return new PageDto(
      plainToInstance(EmbeddedChatConversationItemDto, result.data),
      new PageMetaDto({
        take: dto.take || 20,
        page: 1,
        itemCount: result.data.length,
      }),
    );
  }

  @Post('passport')
  @ApiBearerAuth('access-token')
  @ApiResponseWrapper(
    GetPassportResponseDto,
    'Get token for public chat',
  )
  async getPassport(
    @CurrentUser() user: UserEntity,
  ): Promise<GetPassportResponseDto> {
    const result = await this.commandBus.execute<
      GetEmbeddedChatPassportCommand,
      GetPassportResponseDto
    >(
      new GetEmbeddedChatPassportCommand({
        xAppCode: DIFY_AI_APP_ID, // currently hard code here
        ...{
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
        },
      }),
    );

    return plainToInstance(GetPassportResponseDto, result);
  }

  

  @Get('messages')
  @ApiResponseWrapper(
    EmbeddedChatMessageItemDto,
    'Get messages by conversation id',
  )
  async getMessagesByConversationId(
    @Query() dto: GetEmbeddedChatMessagesByConversationIdQueryDto,
    @Headers('authorization') authorization?: string,
  ): Promise<PageDto<EmbeddedChatMessageItemDto>> {
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization.replace('Bearer ', '').trim();

    const result = await this.queryBus.execute<
      GetEmbeddedChatMessagesByConversationIdQuery,
      PaginatedResult<EmbeddedChatMessageItemDto>
    >(
      new GetEmbeddedChatMessagesByConversationIdQuery({
        ...dto,
        token,
        skip: dto.skip,
      }),
    );

    const pageMeta = new PageMetaDto({
      take: dto.take,
      page: dto.page,
      itemCount: result.total,
    });

    return new PageDto(
      plainToInstance(EmbeddedChatMessageItemDto, result.data),
      pageMeta,
    );
  }
}
