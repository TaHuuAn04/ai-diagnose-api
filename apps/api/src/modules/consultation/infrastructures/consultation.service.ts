import { Inject, Injectable } from '@nestjs/common';

import {
  IConsultationRepository,
  IImageRepository,
  IResultDiseaseRepository,
  IScheduleRepository,
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { ImageReference, SortDirection } from '@app/core/domain/enums';
import { ImageInfoDto, PageDto, PageMetaDto } from '@app/core/dtos';
import { ExceptionHandler, NotFoundException } from '@app/core/exception';

import { GetConsultingRoomDto } from '../../appointment/dtos';
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

    @Inject(REPOSITORY_INJECTION_TOKEN.RESULT_DISEASE_REPOSITORY)
    private readonly resultDiseaseRepository: IResultDiseaseRepository,
  ) { }

  async getConsultationHistory(
    patientId: string,
    request: GetConsultationHistoryDto
  ): Promise<PageDto<GetConsultationResponseDto>> {
    try {
      // Get consultations information 
      const { consultations, total } = await this.consultationRepository.findConsultationHistory(patientId, request);

      // Create page metadata
      const pageMeta = new PageMetaDto({
        page: request.page,
        take: request.take,
        itemCount: total
      });

      const consultationHistoryDtos = await Promise.all(consultations.map(async (consultation) => {
        const appointmentShortInfo = plainToInstance(GetConsultingRoomDto, {
          doctorId: consultation.doctorId,
          date: consultation.appointment?.workingTime?.shift?.date,
          timeStart: consultation.appointment?.workingTime?.shift?.from,
          timeEnd: consultation.appointment?.workingTime?.shift?.to,
        });
        const roomNumber = await this.scheduleRepository.findRoomByDoctorAndShift(appointmentShortInfo);
        if (!roomNumber) {
          throw new NotFoundException(`Room not found for appointment in consultation with id ${consultation.id}`);
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
          doctorName: `${consultation.doctor?.user?.firstName ?? ''} ${consultation.doctor?.user?.lastName ?? ''}`,
          department: consultation.doctor?.department,
          date: consultation.appointment?.workingTime?.shift?.date,
          from: consultation.appointment?.workingTime?.shift?.from,
          to: consultation.appointment?.workingTime?.shift?.to,
          room: roomNumber,
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
