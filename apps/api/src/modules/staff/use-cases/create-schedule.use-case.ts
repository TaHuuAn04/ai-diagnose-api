import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { CreateScheduleRequestDto, GetScheduleResponseDto } from '../dtos';
import { IStaffService } from '../interfaces'

export class CreateScheduleCommand implements ICommand {
  constructor(
    public readonly staffId: string,
    public readonly request: CreateScheduleRequestDto
  ) { }
}

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleCommandHandler
  implements ICommandHandler<CreateScheduleCommand, GetScheduleResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(command: CreateScheduleCommand): Promise<GetScheduleResponseDto> {
    const result = await this.staffService.createSchedule(
      command.staffId,
      command.request
    );

    return result;
  }
}
