import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAIDiagnosisResultRepository } from '@api/repository';

import { NotFoundException } from '@app/core/exception';

import { GetAiDiagnosisResultResponseDto } from '../dtos';

export class GetAiDiagnosisResultQuery implements IQuery {
  constructor(public readonly consultationId: string) {}
}

@QueryHandler(GetAiDiagnosisResultQuery)
export class GetAiDiagnosisResultQueryHandler
  implements IQueryHandler<GetAiDiagnosisResultQuery, GetAiDiagnosisResultResponseDto>
{
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.AI_DIAGNOSIS_RESULT_REPOSITORY)
    private readonly aiDiagnosisResultRepository: IAIDiagnosisResultRepository,
  ) {}

  async execute(
    query: GetAiDiagnosisResultQuery,
  ): Promise<GetAiDiagnosisResultResponseDto> {
    const result = await this.aiDiagnosisResultRepository.findOne({
      where: { consultationId: query.consultationId },
      relations: [
        {
          relation: 'diseases',
        },
        // We need disease details (like name)
        {
          relation: 'diseases.disease',
        },
      ],
    });

    if (!result) {
      throw new NotFoundException(
        `AI diagnosis result for consultation ${query.consultationId} not found or still processing`,
      );
    }

    return {
      consultationId: result.consultationId,
      suggestedDiagnosis: result.suggestedDiagnosis,
      severityLevel: result.severityLevel,
      aiAdvice: result.aiAdvice ?? undefined,
      diseases:
        result.diseases?.map((d: any) => ({
          diseaseId: d.diseaseId,
          diseaseName: d.disease?.name || 'Unknown',
          accuracy: d.accuracy,
        })) || [],
    };
  }
}
