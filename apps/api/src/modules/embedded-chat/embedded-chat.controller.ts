import { Readable } from 'stream';

import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@api/guards';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { memoryStorage } from 'multer';

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
  GetEmbeddedChatMessagesResponseDto,
  GetPassportResponseDto,
} from './dtos';
import {
  ChatMessageBlockCommand,
  ChatMessageStreamCommand,
  GetEmbeddedChatConversationQuery,
  GetEmbeddedChatMessagesByConversationIdQuery,
  GetEmbeddedChatPassportCommand,
  UploadFileChatCommand,
} from './use-cases';

@UseGuards(JwtAuthGuard)
@ApiTags('Embedded Chat')
@Controller('embedded-chat')
export class EmbeddedChatController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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
  @ApiSecurity('third-party-token')
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
  @ApiSecurity('third-party-token')
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
          user_id: user.id,
        },
      }),
    );

    return plainToInstance(GetPassportResponseDto, result);
  }

  @IsPublic()
  @ApiSecurity('third-party-token')
  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('Authorization') authorization: string,
  ) {
    if (!authorization) {
      throw new UnauthorizedException();
    }

    const token = authorization.split(' ')[1];
    
    return this.commandBus.execute(
      new UploadFileChatCommand({ file, token }),
    );
  }

  

  @IsPublic()
  @ApiSecurity('third-party-token')
  @Get('messages')
  @ApiResponseWrapper(
    GetEmbeddedChatMessagesResponseDto,
    'Get messages by conversation id',
  )
  async getMessagesByConversationId(
    @Headers('Authorization') authorization: string,
    @Query() dto: GetEmbeddedChatMessagesByConversationIdQueryDto,
  ): Promise<GetEmbeddedChatMessagesResponseDto> {
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
      }),
    );

    return plainToInstance(GetEmbeddedChatMessagesResponseDto, {
      limit: dto.limit ?? 20,
      hasMore: result.hasMore ?? false,
      data: result.data,
    });
  }

  @IsPublic()
  @Get('image-proxy')
  async proxyImage(
    @Query('url') url: string,
    @Query('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!url) {
      throw new BadRequestException('Missing url parameter');
    }

    const difyBaseUrl = this.configService.get<string>('DIFY_AI_API_URL') ?? 'https://api.dify.ai';
    let difyHostname: string;
    try {
      difyHostname = new URL(difyBaseUrl).hostname;
    } catch {
      throw new BadRequestException('Invalid proxy configuration');
    }

    const absoluteUrl = url.startsWith('/') ? `${difyBaseUrl}${url}` : url;

    let targetHostname: string;
    try {
      targetHostname = new URL(absoluteUrl).hostname;
    } catch {
      throw new BadRequestException('Invalid url parameter');
    }

    if (targetHostname !== difyHostname) {
      throw new BadRequestException('URL not allowed');
    }

    const forwardHeaders: Record<string, string> = {};
    if (token) {
      forwardHeaders.Authorization = `Bearer ${token}`;
    }

    const response = await this.httpService.axiosRef.get(absoluteUrl, {
      responseType: 'stream',
      headers: forwardHeaders,
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    (response.data as Readable).pipe(res);
  }
}
