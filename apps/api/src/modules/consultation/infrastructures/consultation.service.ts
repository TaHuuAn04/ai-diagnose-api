import { Inject, Injectable } from '@nestjs/common';

import {
  IConsultationRepository,
  IImageRepository,
  IScheduleRepository,
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { ImageReference, SortDirection } from '@app/core/domain/enums';
import { ImageInfoDto, PageDto, PageMetaDto } from '@app/core/dtos';
import { ExceptionHandler, NotFoundException } from '@app/core/exception';

import { GetConsultationHistoryDto, GetConsultationResponseDto } from '../dtos';
import { IConsultationService } from '../interfaces';


@Injectable()
export class ConsultationService implements IConsultationService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository, 

    @Inject(REPOSITORY_INJECTION_TOKEN.SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,
  ) { }

  async getConsultationHistory(
    patientId: string,
    request: GetConsultationHistoryDto
  ): Promise<PageDto<GetConsultationResponseDto>> {
    try {
      // Get consultations information 
      const results = await this.consultationRepository.findConsultationHistory(patientId, request);
      const consultations = results.data;

      // Create page metadata
      const pageMeta = new PageMetaDto({
        page: request.page,
        take: request.take,
        itemCount: results.total,
      });

      const consultationHistoryDtos = await Promise.all(consultations.map(async (consultation) => {
        if (!consultation.appointment || consultation.appointment.metadata === null) {
          throw new NotFoundException('Appointment information is missing for consultation ID: ' + consultation.id);
        }

        // Get images for the diagnosis result
        const imageEntities = await this.imageRepository.findAll({
            where: {
              referenceId: consultation.id,
              referenceType: ImageReference.CONSULTATION,
            },
            sort: {
              sortBy: 'order',
              sortOrder: SortDirection.DESC
            },
        }); 

        const consultationMapping = {
          id: consultation.id,
          doctorName: consultation.appointment.metadata?.doctorName,
          department: consultation.appointment.metadata?.department,
          date: consultation.appointment.metadata?.date,
          from: consultation.appointment.metadata?.from,
          to: consultation.appointment.metadata?.to,
          room: consultation.appointment.metadata?.room,
          diseases: consultation.diagnosisResult?.diseases?.map((disease: { name: string }) => disease.name) ?? [],
          advices: consultation.diagnosisResult?.advices ?? '',
          prescription: consultation.diagnosisResult?.prescription ?? '',
          symptoms: consultation.diagnosisResult?.symstomsText ?? '',
          images: plainToInstance(ImageInfoDto, imageEntities.data)
        }
        return plainToInstance(GetConsultationResponseDto, consultationMapping);
      }));

      return new PageDto<GetConsultationResponseDto>(consultationHistoryDtos, pageMeta);

    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error fetching consultation history');
    }
  }
}
