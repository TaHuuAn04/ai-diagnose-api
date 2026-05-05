import { Readable } from 'stream';

import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { plainToInstance } from 'class-transformer';

import {
  ChatMessageDifyAiBodyDto,
  ChatMessageDifyAiInputDto,
  ChatMessageDifyAiResponseDto,
  UploadFileChatDifyAiResponseDto,
} from '../../../dify-ai/dtos';
import {
  ChatMessageBlockDifyAiCommand,
  ChatMessageStreamDifyAiCommand,
  UploadFileChatDifyAiCommand,
} from '../../../dify-ai/use-cases';
import {
  ChatMessageBlockInputDto,
  ChatMessageBlockResponseDto,
  ChatMessageStreamInputDto,
  UploadFileChatInputDto,
} from '../../dtos';
import { IEmbeddedChatService } from '../../use-cases/adapters/embedded-chat.service.interface';

@Injectable()
export class EmbeddedChatService implements IEmbeddedChatService {
  constructor(private readonly commandBus: CommandBus) {}

  async chatMessageBlock(
    input: ChatMessageBlockInputDto,
  ): Promise<ChatMessageBlockResponseDto> {
    const { token, query, conversation_id, parent_message_id } = input;
    
    const commandInput: ChatMessageDifyAiInputDto = {
      body: {
        inputs: {},
        response_mode: 'blocking',
        query,
        ...(conversation_id ? { conversation_id } : {}),
        files: [],
        ...(parent_message_id ? { parent_message_id } : {}),
        // user: decodedToken?.end_user_id ?? 'abc-123',
      },
      token,
    };

    const result = await this.commandBus.execute<
      ChatMessageBlockDifyAiCommand,
      ChatMessageDifyAiResponseDto
    >(new ChatMessageBlockDifyAiCommand(commandInput));

    return plainToInstance(ChatMessageBlockResponseDto, {
      ...result,
      query,
    });
  }

  async chatMessageStream(input: ChatMessageStreamInputDto): Promise<Readable> {
    const { token, query, conversation_id, parent_message_id, files } = input;
    

    const commandInput: ChatMessageDifyAiInputDto = {
      body: {
        inputs: {
          patientId: 'ceb3dcf4-ccab-4ab6-9bf9-a9599fd8ef0b'
        },
        response_mode: 'streaming',
        query,
        ...(conversation_id ? { conversation_id } : {}),
        files: (files ?? []) as ChatMessageDifyAiBodyDto['files'],
        ...(parent_message_id ? { parent_message_id } : {}),
      },
      token,
    };

    const result = await this.commandBus.execute<
      ChatMessageStreamDifyAiCommand,
      Readable
    >(new ChatMessageStreamDifyAiCommand(commandInput));

    return result;
  }

  async uploadFile(input: UploadFileChatInputDto): Promise<UploadFileChatDifyAiResponseDto> {
    const result = await this.commandBus.execute<
      UploadFileChatDifyAiCommand,
      UploadFileChatDifyAiResponseDto
    >(new UploadFileChatDifyAiCommand(input));

    return result;
  }
}
