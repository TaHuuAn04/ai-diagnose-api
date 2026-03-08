import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from 'apps/api/src/common/enums';

import { UploadFileChatDifyAiResponseDto } from '../../dify-ai/dtos';
import { UploadFileChatInputDto } from '../dtos';

import { IEmbeddedChatService } from './adapters/embedded-chat.service.interface';

export class UploadFileChatCommand implements ICommand {
  constructor(public readonly input: UploadFileChatInputDto) {}
}

@CommandHandler(UploadFileChatCommand)
export class UploadFileChatCommandHandler
  implements
    ICommandHandler<UploadFileChatCommand, UploadFileChatDifyAiResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.EMBEDDED_CHAT_SERVICE)
    private readonly embeddedChatService: IEmbeddedChatService,
  ) {}

  async execute(
    command: UploadFileChatCommand,
  ): Promise<UploadFileChatDifyAiResponseDto> {
    const { input } = command;
    return this.embeddedChatService.uploadFile(input);
  }
}
