import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  UpdateAdmissionStaffAccountRequestDto,
  UpdateAdmissionStaffAccountResponseDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class UpdateAdmissionStaffAccountCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateAdmissionStaffAccountRequestDto,
  ) {}
}

@CommandHandler(UpdateAdmissionStaffAccountCommand)
export class UpdateAdmissionStaffAccountCommandHandler
  implements
    ICommandHandler<
      UpdateAdmissionStaffAccountCommand,
      UpdateAdmissionStaffAccountResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: UpdateAdmissionStaffAccountCommand,
  ): Promise<UpdateAdmissionStaffAccountResponseDto> {
    const { id, payload } = command;
    return this.adminService.updateAdmissionStaffAccount(id, payload);
  }
}
