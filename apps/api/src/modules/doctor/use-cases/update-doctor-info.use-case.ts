import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from '@api/enums';
import { UpdateOrDeleteResponseDto } from 'apps/api/src/common/dtos';

import { IDoctorService } from '../doctor.interface';
import { UpdateDoctorInfoRequestDto } from '../dtos';

export class UpdateDoctorInfoCommand implements ICommand {
  constructor(
    public readonly doctorId: string,
    public readonly request: UpdateDoctorInfoRequestDto
  ) { }
}

@CommandHandler(UpdateDoctorInfoCommand)
export class UpdateDoctorInfoCommandHandler
  implements ICommandHandler<UpdateDoctorInfoCommand, UpdateOrDeleteResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.DOCTOR_SERVICE)
    private readonly doctorService: IDoctorService
  ) {}

  async execute(command: UpdateDoctorInfoCommand): Promise<UpdateOrDeleteResponseDto> {
    const result = await this.doctorService.updateDoctorInfo(
      command.doctorId,
      command.request
    );

    return result;
  }
}
