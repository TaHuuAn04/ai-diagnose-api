import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { DeleteAdmissionStaffAccountResponseDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class DeleteAdmissionStaffAccountCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteAdmissionStaffAccountCommand)
export class DeleteAdmissionStaffAccountCommandHandler
  implements
    ICommandHandler<
      DeleteAdmissionStaffAccountCommand,
      DeleteAdmissionStaffAccountResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: DeleteAdmissionStaffAccountCommand,
  ): Promise<DeleteAdmissionStaffAccountResponseDto> {
    const { id } = command;
    return this.adminService.deleteAdmissionStaffAccount(id);
  }
}
