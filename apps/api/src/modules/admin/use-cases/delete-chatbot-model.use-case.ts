import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IAdminService } from '../interfaces';

export class DeleteChatbotModelCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteChatbotModelCommand)
export class DeleteChatbotModelCommandHandler
  implements ICommandHandler<DeleteChatbotModelCommand, boolean>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: DeleteChatbotModelCommand,
  ): Promise<boolean> {
    const { id } = command;
    return this.adminService.deleteChatbotModel(id);
  }
}
