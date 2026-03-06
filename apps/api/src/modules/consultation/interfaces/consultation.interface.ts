import { PageDto } from "@app/core/dtos";

import { GetConsultationHistoryDto, GetConsultationResponseDto } from "../dtos";

export interface IConsultationService {
  getConsultationHistory(
    patientId: string,
    request: GetConsultationHistoryDto
  ): Promise<PageDto<GetConsultationResponseDto>>;
}
