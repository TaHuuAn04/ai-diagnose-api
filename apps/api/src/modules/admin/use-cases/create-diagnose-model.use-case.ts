import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  CreateDiagnoseModelRequestDto,
  DiagnoseModelResponseDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class CreateDiagnoseModelCommand implements ICommand {
  constructor(public readonly payload: CreateDiagnoseModelRequestDto) {}
}

@CommandHandler(CreateDiagnoseModelCommand)
export class CreateDiagnoseModelCommandHandler
  implements
    ICommandHandler<
      CreateDiagnoseModelCommand,
      DiagnoseModelResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: CreateDiagnoseModelCommand,
  ): Promise<DiagnoseModelResponseDto> {
    const { payload } = command;
    return this.adminService.createDiagnoseModel(payload);
  }
}
