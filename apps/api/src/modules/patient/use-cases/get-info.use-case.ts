import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { PatientInfoDto } from "../dtos";
import { IPatientService } from "../interfaces";

export class GetInfoQuery {
  constructor(
    public readonly userId: string,
  ) {}
}

@QueryHandler(GetInfoQuery)
export class GetInfoQueryHandler 
  implements IQueryHandler<GetInfoQuery, PatientInfoDto> 
{
  constructor(
    @Inject(INJECTION_TOKEN.PATIENT_SERVICE)
    private readonly patientService: IPatientService
  ) {}

  async execute(query: GetInfoQuery): Promise<PatientInfoDto> {
    // Implement the logic to get the patient info for the user
    const patientInfo = await this.patientService.getInfo(
      query.userId
    );

    return patientInfo;
  }
}