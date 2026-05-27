import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAIDiagnosisResultRepository } from '@api/repository';
import { plainToInstance } from 'class-transformer';

import { AIResultDiseaseEntity } from '@app/core/domain/entities';
import { NotFoundException } from '@app/core/exception';

import { AiResultDiseaseDto, GetAiDiagnosisResultResponseDto, LesionResultDto } from '../dtos';

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

    const allDiseases: AIResultDiseaseEntity[] = result.diseases || [];
    const proofImages: string[] = result.proof ? JSON.parse(result.proof) : [];

    // Group diseases by lesionIndex
    const lesionMap = new Map<number, AIResultDiseaseEntity[]>();
    for (const d of allDiseases) {
      const idx = d.lesionIndex ?? 0;
      if (!lesionMap.has(idx)) lesionMap.set(idx, []);
      lesionMap.get(idx)!.push(d);
    }

    // proof[0] = imageWithAllBboxes, proof[1..N] = cropped images per lesion
    const imageWithAllBboxes = proofImages[0] ?? undefined;

    const suggestedDiagnoses = result.suggestedDiagnosis ?? [];
    const lesions: LesionResultDto[] = Array.from(lesionMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([lesionIndex, diseaseRows], i) => {
        const sorted = [...diseaseRows].sort((a, b) => b.accuracy - a.accuracy);
        const topRow = sorted[0];
        return plainToInstance(LesionResultDto, {
          lesionIndex,
          topDisease: suggestedDiagnoses[i]?.diseaseName ?? topRow?.disease?.name ?? 'Unknown',
          severity: result.severityLevel ?? 'MINOR',
          croppedImage: proofImages[i + 1] ?? undefined,
          diseases: sorted.map(d => plainToInstance(AiResultDiseaseDto, {
            diseaseId: d.diseaseId,
            diseaseName: d.disease?.name ?? 'Unknown',
            accuracy: d.accuracy,
          })),
        });
      });

    const overallTopDisease = lesions[0]?.topDisease ?? 'Chẩn đoán AI';

    return plainToInstance(GetAiDiagnosisResultResponseDto, {
      consultationId: result.consultationId,
      suggestedDiagnosis: overallTopDisease,
      severityLevel: result.severityLevel ?? undefined,
      aiAdvice: result.aiAdvice ?? undefined,
      imageWithAllBboxes,
      lesions,
    });
  }
}
