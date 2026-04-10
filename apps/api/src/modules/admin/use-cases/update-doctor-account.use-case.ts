import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  UpdateDoctorAccountRequestDto,
  UpdateDoctorAccountResponseDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class UpdateDoctorAccountCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateDoctorAccountRequestDto,
  ) {}
}

@CommandHandler(UpdateDoctorAccountCommand)
export class UpdateDoctorAccountCommandHandler
  implements
    ICommandHandler<UpdateDoctorAccountCommand, UpdateDoctorAccountResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: UpdateDoctorAccountCommand,
  ): Promise<UpdateDoctorAccountResponseDto> {
    const { id, payload } = command;
    return this.adminService.updateDoctorAccount(id, payload);
  }
}
