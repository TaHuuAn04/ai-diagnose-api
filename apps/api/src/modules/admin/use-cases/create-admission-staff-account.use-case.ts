import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  CreateAdmissionStaffAccountRequestDto,
  CreateAdmissionStaffAccountResponseDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class CreateAdmissionStaffAccountCommand implements ICommand {
  constructor(public readonly payload: CreateAdmissionStaffAccountRequestDto) {}
}

@CommandHandler(CreateAdmissionStaffAccountCommand)
export class CreateAdmissionStaffAccountCommandHandler
  implements
    ICommandHandler<
      CreateAdmissionStaffAccountCommand,
      CreateAdmissionStaffAccountResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: CreateAdmissionStaffAccountCommand,
  ): Promise<CreateAdmissionStaffAccountResponseDto> {
    const { payload } = command;
    return this.adminService.createAdmissionStaffAccount(payload);
  }
}
