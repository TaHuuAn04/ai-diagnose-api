import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

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
  ) {}

  async execute(
    command: GetEmbeddedChatPassportCommand,
  ): Promise<GetPassportResponseDto> {
    // Ai metadata is stored in jsonb column, so we need to use jsonb_extract_path_text to get the value
    const { input } = command;
    const passport = await this.difyEmbeddedChatService.getPassport({
      query: {
        user_id: input.user_id,
      },
      headers: {
        'x-app-code': input.xAppCode,
      },
    });
    return { access_token: passport.access_token };
  }
}
