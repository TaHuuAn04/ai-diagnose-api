import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { DeleteDoctorAccountResponseDto } from '../dtos';
import { IAdminService } from '../interfaces';

export class DeleteDoctorAccountCommand implements ICommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteDoctorAccountCommand)
export class DeleteDoctorAccountCommandHandler
  implements
    ICommandHandler<DeleteDoctorAccountCommand, DeleteDoctorAccountResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: DeleteDoctorAccountCommand,
  ): Promise<DeleteDoctorAccountResponseDto> {
    const { id } = command;
    return this.adminService.deleteDoctorAccount(id);
  }
}
