import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';
import { UpdateOrDeleteResponseDto } from 'apps/api/src/common/dtos';

import { UpdateStaffInfoRequestDto } from '../dtos';
import { IStaffService } from '../interfaces';

export class UpdateStaffInfoCommand implements ICommand {
  constructor(
    public readonly staffId: string,
    public readonly request: UpdateStaffInfoRequestDto
  ) { }
}

@CommandHandler(UpdateStaffInfoCommand)
export class UpdateStaffInfoCommandHandler
  implements ICommandHandler<UpdateStaffInfoCommand, UpdateOrDeleteResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.STAFF_SERVICE)
    private readonly staffService: IStaffService
  ) {}

  async execute(command: UpdateStaffInfoCommand): Promise<UpdateOrDeleteResponseDto> {
    const result = await this.staffService.updateStaffInfo(
      command.staffId,
      command.request
    );

    return result;
  }
}
