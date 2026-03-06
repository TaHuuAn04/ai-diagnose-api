import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { INJECTION_TOKEN } from "@api/enums";

import { PageDto } from "@app/core/dtos";

import { GetConsultationHistoryDto, GetConsultationResponseDto } from "../dtos";
import { IConsultationService } from "../interfaces";

export class GetConsultationHistoryQuery {
  constructor(
    public readonly patientId: string,
    public readonly request: GetConsultationHistoryDto,
  ) {}
}

@QueryHandler(GetConsultationHistoryQuery)
export class GetConsultationHistoryQueryHandler 
  implements IQueryHandler<GetConsultationHistoryQuery, PageDto<GetConsultationResponseDto>> 
{
  constructor(
    @Inject(INJECTION_TOKEN.CONSULTATION_SERVICE)
    private readonly consultationService: IConsultationService
  ) {}

  async execute(query: GetConsultationHistoryQuery): Promise<PageDto<GetConsultationResponseDto>> {
    const consultations = await this.consultationService.getConsultationHistory(
      query.patientId,
      query.request
    );

    return consultations;
  }
}
