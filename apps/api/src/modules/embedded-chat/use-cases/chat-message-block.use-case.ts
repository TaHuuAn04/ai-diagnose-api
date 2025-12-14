import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { ChatMessageBlockInputDto, ChatMessageBlockResponseDto } from '../dtos';

import { IEmbeddedChatService } from './adapters/embedded-chat.service.interface';

export class ChatMessageBlockCommand implements ICommand {
  constructor(public readonly input: ChatMessageBlockInputDto) {}
}

@CommandHandler(ChatMessageBlockCommand)
export class ChatMessageBlockCommandHandler
  implements ICommandHandler<ChatMessageBlockCommand>
{
  constructor(
    @Inject(INJECTION_TOKEN.EMBEDDED_CHAT_SERVICE)
    private readonly embeddedChatService: IEmbeddedChatService,
  ) {}

  async execute(
    command: ChatMessageBlockCommand,
  ): Promise<ChatMessageBlockResponseDto> {
    const { input } = command;
    return this.embeddedChatService.chatMessageBlock(input);
  }
}
