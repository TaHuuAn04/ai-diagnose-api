import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';
import { UpdateOrDeleteResponseDto } from 'apps/api/src/common/dtos';

import { UpdateScheduleRequestDto } from '../dtos';
import { IStaffService } from '../interfaces'

export class UpdateScheduleCommand implements ICommand {
  constructor(
    public readonly staffId: string,
    public readonly scheduleId: string,
    public readonly request: UpdateScheduleRequestDto
  ) { }
}

@CommandHandler(UpdateScheduleCommand)
export class UpdateScheduleCommandHandler
  implements ICommandHandler<UpdateScheduleCommand, UpdateOrDeleteResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(command: UpdateScheduleCommand): Promise<UpdateOrDeleteResponseDto> {
    const result = await this.staffService.updateSchedule(
      command.staffId,
      command.scheduleId,
      command.request
    );

    return result;
  }
}
