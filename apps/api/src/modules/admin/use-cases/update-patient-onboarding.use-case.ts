import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import {
  UpdatePatientOnboardingRequestDto,
  UpdatePatientOnboardingResponseDto,
} from '../dtos';
import { IAdminService } from '../interfaces';

export class UpdatePatientOnboardingCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly payload: UpdatePatientOnboardingRequestDto,
  ) {}
}

@CommandHandler(UpdatePatientOnboardingCommand)
export class UpdatePatientOnboardingCommandHandler
  implements
    ICommandHandler<
      UpdatePatientOnboardingCommand,
      UpdatePatientOnboardingResponseDto
    >
{
  constructor(
    @Inject(INJECTION_TOKEN.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  async execute(
    command: UpdatePatientOnboardingCommand,
  ): Promise<UpdatePatientOnboardingResponseDto> {
    const { id, payload } = command;
    return this.adminService.updatePatientOnboarding(id, payload);
  }
}
