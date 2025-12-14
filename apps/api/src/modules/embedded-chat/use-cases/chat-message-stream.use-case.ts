import { Readable } from 'stream';

import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { ChatMessageStreamInputDto } from '../dtos';

import { IEmbeddedChatService } from './adapters/embedded-chat.service.interface';

export class ChatMessageStreamCommand implements ICommand {
  constructor(public readonly input: ChatMessageStreamInputDto) {}
}

@CommandHandler(ChatMessageStreamCommand)
export class ChatMessageStreamCommandHandler
  implements ICommandHandler<ChatMessageStreamCommand>
{
  constructor(
    @Inject(INJECTION_TOKEN.EMBEDDED_CHAT_SERVICE)
    private readonly embeddedChatService: IEmbeddedChatService,
  ) {}

  async execute(command: ChatMessageStreamCommand): Promise<Readable> {
    const { input } = command;
    return this.embeddedChatService.chatMessageStream(input);
  }
}
