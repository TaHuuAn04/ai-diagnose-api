import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { INJECTION_TOKEN } from "@api/enums";

import { CreatePatientResponseDto } from '../dtos';
import { IPatientService } from "../interfaces";


export class CreatePatientCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(CreatePatientCommand)
export class CreatePatientCommandHandler
  implements ICommandHandler<CreatePatientCommand, CreatePatientResponseDto>
{
  constructor(
    @Inject(INJECTION_TOKEN.PATIENT_SERVICE)
    private readonly patientService: IPatientService,
  ) {}

  async execute(command: CreatePatientCommand): Promise<CreatePatientResponseDto> {
    const createdUser = await this.patientService.createPatient(
      command.userId,
    );

    return createdUser;
  }
}
