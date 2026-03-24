import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { IConsultationService } from "../interfaces";
import { GetMonthlyDiseasesRequestDto, GetMonthlyDiseasesResponseDto } from "../dtos";

export class GetStatisticDiseaseQuery {
  constructor(
    public readonly request: GetMonthlyDiseasesRequestDto
  ) {}
}

@QueryHandler(GetStatisticDiseaseQuery)
export class GetStatisticDiseaseQueryHandler 
  implements IQueryHandler<GetStatisticDiseaseQuery, GetMonthlyDiseasesResponseDto[]> 
{
  constructor(
    @Inject(INJECTION_TOKEN.CONSULTATION_SERVICE)
    private readonly consultationService: IConsultationService
  ) {}

  async execute(query: GetStatisticDiseaseQuery): Promise<GetMonthlyDiseasesResponseDto[]> {
    const result = await this.consultationService.getStatisticDisease(
      query.request
    );

    return result;
  }
}
