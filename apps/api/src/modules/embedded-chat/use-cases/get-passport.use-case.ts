import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { IChatbotRepository } from 'apps/api/src/core/repository';

import { DifyEmbeddedChatService } from '../../dify-ai/dify-embedded-chat.service';
import {
  GetPassportInputDto,
  GetPassportResponseDto,
} from '../dtos';

export class GetEmbeddedChatPassportCommand implements ICommand {
  constructor(public readonly input: GetPassportInputDto) {}
}

@CommandHandler(GetEmbeddedChatPassportCommand)
export class GetEmbeddedChatPassportCommandHandler
  implements
    ICommandHandler<
      GetEmbeddedChatPassportCommand,
      GetPassportResponseDto
    >
{
  constructor(
    private readonly difyEmbeddedChatService: DifyEmbeddedChatService,

    @Inject(REPOSITORY_INJECTION_TOKEN.CHATBOT_REPOSITORY)
    private readonly chatbotRepository: IChatbotRepository,
  ) {}

  async execute(
    command: GetEmbeddedChatPassportCommand,
  ): Promise<GetPassportResponseDto> {
    const { input } = command;

    const publicChatbot = await this.chatbotRepository.findOne({ where: { isPublic: true } });
    if (!publicChatbot) {
      throw new Error('No public chatbot model configured');
    }

    const passport = await this.difyEmbeddedChatService.getPassport({
      query: {
        user_id: input.user_id,
      },
      headers: {
        'x-app-code': publicChatbot.accessToken,
      },
    });
    return { access_token: passport.access_token };
  }
}
