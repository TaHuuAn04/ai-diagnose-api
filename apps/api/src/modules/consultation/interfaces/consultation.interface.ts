import { PageDto } from "@app/core/dtos";

import { GetConsultationHistoryDto, GetConsultationResponseDto, GetMonthlyDiseasesRequestDto, GetMonthlyDiseasesResponseDto } from "../dtos";

export interface IConsultationService {
  getConsultationHistory(
    patientId: string,
    request: GetConsultationHistoryDto
  ): Promise<PageDto<GetConsultationResponseDto>>;

  getStatisticDisease(
    request: GetMonthlyDiseasesRequestDto
  ): Promise<GetMonthlyDiseasesResponseDto[]>;
}
