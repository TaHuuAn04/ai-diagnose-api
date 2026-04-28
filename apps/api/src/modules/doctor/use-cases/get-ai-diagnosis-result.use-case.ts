import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAIDiagnosisResultRepository } from '@api/repository';
import { plainToInstance } from 'class-transformer';

import { AIResultDiseaseEntity } from '@app/core/domain/entities';
import { NotFoundException } from '@app/core/exception';

import { AiResultDiseaseDto, GetAiDiagnosisResultResponseDto } from '../dtos';

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
      relations: ['diseases', 'diseases.disease'],
    });

    if (!result) {
      throw new NotFoundException(
        `AI diagnosis result for consultation ${query.consultationId} not found or still processing`,
      );
    }

    const diseases: AIResultDiseaseEntity[] = result.diseases || [];
    const sortedDiseases = [...diseases].sort((a, b) => b.accuracy - a.accuracy);
    const topDisease = sortedDiseases[0]?.disease?.name || 'Chẩn đoán AI';

    return plainToInstance(GetAiDiagnosisResultResponseDto, {
      consultationId: result.consultationId,
      suggestedDiagnosis: topDisease,
      severityLevel: result.severityLevel ?? undefined,
      aiAdvice: result.aiAdvice ?? undefined,
      images: result.proof ? JSON.parse(result.proof) : [],
      diseases: sortedDiseases.map((d) => plainToInstance(AiResultDiseaseDto, {
          diseaseId: d.diseaseId,
          diseaseName: d.disease?.name ?? 'Unknown',
          accuracy: d.accuracy,
      })),
    });
  }
}
