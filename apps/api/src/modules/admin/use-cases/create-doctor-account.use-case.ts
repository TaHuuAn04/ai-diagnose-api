import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  CreateDoctorAccountRequestDto,
  CreateDoctorAccountResponseDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class CreateDoctorAccountCommand implements ICommand {
  constructor(public readonly payload: CreateDoctorAccountRequestDto) {}
}

@CommandHandler(CreateDoctorAccountCommand)
export class CreateDoctorAccountCommandHandler
  implements
    ICommandHandler<CreateDoctorAccountCommand, CreateDoctorAccountResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: CreateDoctorAccountCommand,
  ): Promise<CreateDoctorAccountResponseDto> {
    const { payload } = command;
    return this.adminService.createDoctorAccount(payload);
  }
}
