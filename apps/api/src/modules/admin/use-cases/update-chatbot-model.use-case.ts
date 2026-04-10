import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  ChatbotModelResponseDto,
  UpdateChatbotModelRequestDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class UpdateChatbotModelCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateChatbotModelRequestDto,
  ) {}
}

@CommandHandler(UpdateChatbotModelCommand)
export class UpdateChatbotModelCommandHandler
  implements
    ICommandHandler<
      UpdateChatbotModelCommand,
      ChatbotModelResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: UpdateChatbotModelCommand,
  ): Promise<ChatbotModelResponseDto> {
    const { id, payload } = command;
    return this.adminService.updateChatbotModel(id, payload);
  }
}
