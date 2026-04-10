import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  ChatbotModelResponseDto,
  CreateChatbotModelRequestDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class CreateChatbotModelCommand implements ICommand {
  constructor(public readonly payload: CreateChatbotModelRequestDto) {}
}

@CommandHandler(CreateChatbotModelCommand)
export class CreateChatbotModelCommandHandler
  implements
    ICommandHandler<
      CreateChatbotModelCommand,
      ChatbotModelResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: CreateChatbotModelCommand,
  ): Promise<ChatbotModelResponseDto> {
    const { payload } = command;
    return this.adminService.createChatbotModel(payload);
  }
}
