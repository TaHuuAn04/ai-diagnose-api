import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { IAdminService } from '../interfaces';

export class DeleteDiagnoseModelCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteDiagnoseModelCommand)
export class DeleteDiagnoseModelCommandHandler
  implements ICommandHandler<DeleteDiagnoseModelCommand, boolean>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: DeleteDiagnoseModelCommand,
  ): Promise<boolean> {
    const { id } = command;
    return this.adminService.deleteDiagnoseModel(id);
  }
}
