import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';

import { GetScheduleResponseDto, ImportScheduleFromCSVRequestDto } from '../dtos';
import { IStaffService } from '../interfaces'

export class ImportScheduleFromCSVCommand implements ICommand {
  constructor(
    public readonly staffId: string,
    public readonly request: ImportScheduleFromCSVRequestDto
  ) { }
}

@CommandHandler(ImportScheduleFromCSVCommand)
export class ImportScheduleFromCSVCommandHandler
  implements ICommandHandler<ImportScheduleFromCSVCommand, GetScheduleResponseDto[]>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(command: ImportScheduleFromCSVCommand): Promise<GetScheduleResponseDto[]> {
    const result = await this.staffService.importScheduleFromCSV(
      command.staffId,
      command.request
    );

    return result;
  }
}
