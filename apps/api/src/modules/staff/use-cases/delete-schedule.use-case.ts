import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';
import { UpdateOrDeleteResponseDto } from 'apps/api/src/common/dtos';

import { DeleteScheduleRequestDto } from '../dtos';
import { IStaffService } from '../interfaces'


export class DeleteScheduleCommand implements ICommand {
  constructor(
    public readonly request: DeleteScheduleRequestDto
  ) { }
}

@CommandHandler(DeleteScheduleCommand)
export class DeleteScheduleCommandHandler
  implements ICommandHandler<DeleteScheduleCommand, UpdateOrDeleteResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(command: DeleteScheduleCommand): Promise<UpdateOrDeleteResponseDto> {
    const result = await this.staffService.deleteSchedule(
      command.request
    );

    return result;
  }
}
