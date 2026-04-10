import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  DiagnoseModelResponseDto,
  UpdateDiagnoseModelRequestDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class UpdateDiagnoseModelCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdateDiagnoseModelRequestDto,
  ) {}
}

@CommandHandler(UpdateDiagnoseModelCommand)
export class UpdateDiagnoseModelCommandHandler
  implements
    ICommandHandler<
      UpdateDiagnoseModelCommand,
      DiagnoseModelResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: UpdateDiagnoseModelCommand,
  ): Promise<DiagnoseModelResponseDto> {
    const { id, payload } = command;
    return this.adminService.updateDiagnoseModel(id, payload);
  }
}
