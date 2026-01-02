import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from "@api/enums";

import { PatientInfoDto, UpdatePatientDto } from '../dtos';
import { IPatientService } from "../interfaces";


export class UpdatePatientCommand {
  constructor(
    public readonly userId: string,
    public readonly input: UpdatePatientDto,
  ) {}
}

@CommandHandler(UpdatePatientCommand)
export class UpdatePatientCommandHandler
  implements ICommandHandler<UpdatePatientCommand, PatientInfoDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.PATIENT_SERVICE)
    private readonly patientService: IPatientService,
  ) {}

  async execute(command: UpdatePatientCommand): Promise<PatientInfoDto> {
    const updatedUser = await this.patientService.updatePatient(
      command.userId,
      command.input
    );

    return updatedUser;
  }
}
