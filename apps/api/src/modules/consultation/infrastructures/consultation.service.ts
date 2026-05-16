import { Inject, Injectable } from '@nestjs/common';

import {
  IConsultationRepository,
  IDoctorRepository,
  IImageRepository,
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { ImageReference, SortDirection } from '@app/core/domain/enums';
import { ImageInfoDto, PageDto, PageMetaDto } from '@app/core/dtos';
import { BadRequestException, ExceptionHandler, NotFoundException } from '@app/core/exception';

import { ClinicalInfoDto, GetConsultationHistoryDto, GetConsultationResponseDto, GetMonthlyDiseasesRequestDto, GetMonthlyDiseasesResponseDto, PrescriptionItemDto } from '../dtos';
import { IConsultationService } from '../interfaces';


@Injectable()
export class ConsultationService implements IConsultationService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository, 

    @Inject(REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository,
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

        const prescription = consultation.diagnosisResult?.prescription?.map(p => plainToInstance(PrescriptionItemDto, {
          name: p.name,
          concentration: p.concentration,
          quantity: p.quantity,
          dosage: p.dosage,
          duration: p.duration
        })) ?? [];

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

        const doctorUser = consultation.doctor?.user;
        const doctorName = doctorUser
          ? `${doctorUser.firstName || ''} ${doctorUser.lastName || ''}`.trim()
          : (consultation.appointment.metadata?.doctorName ?? '');

        const consultationMapping = {
          id: consultation.id,
          doctorName,
          department: consultation.doctor?.department
            || consultation.appointment.metadata?.department
            || '',
          date: consultation.appointment.metadata?.date,
          from: consultation.appointment.metadata?.from,
          to: consultation.appointment.metadata?.to,
          room: consultation.appointment.metadata?.room,
          diseases: consultation.diagnosisResult?.diseases?.map((disease: { name: string }) => disease.name) ?? [],
          advices: consultation.diagnosisResult?.advices ?? '',
          prescription,
          symptoms: consultation.diagnosisResult?.symstomsText ?? '',
          description: consultation.diagnosisResult?.description ?? '',
          images: plainToInstance(ImageInfoDto, imageEntities.data),
          clinicalInfo: plainToInstance(ClinicalInfoDto,consultation.diagnosisResult?.clinicalInfo ?? null),
        }
        return plainToInstance(GetConsultationResponseDto, consultationMapping);
      }));

      return new PageDto<GetConsultationResponseDto>(consultationHistoryDtos, pageMeta);

    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error fetching consultation history');
    }
  }

  async getStatisticDisease(
    userId: string,
    request: GetMonthlyDiseasesRequestDto
  ): Promise<GetMonthlyDiseasesResponseDto[]> {
    try {
      if (request.startMonthDate > request.endMonthDate) {
        throw new BadRequestException('Invalid month');
      }

      const doctor = await this.doctorRepository.findOne({
        where: {
          userId: userId,
        },
      });
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      const consultations = await this.consultationRepository.findConsultationWithDepartmentRelated(
        doctor.department,
        request
      );

      const diseaseCounts = consultations.reduce<Record<string, number>>((acc, consultation) => {
        const diseases = consultation.diagnosisResult?.diseases;
        if (diseases) {
          diseases.forEach((disease: { name: string }) => {
            acc[disease.name] = (acc[disease.name] || 0) + 1;
          });
        }
        return acc;
      }, {});

      // Sort diseases by count and select 4 most common diseases, the rest diseases not including 4 most common will be plus together and have new name "Other"
      const allSortedDiseases = Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1]);
      const sortedDiseases = allSortedDiseases.slice(0, 4);
      const otherCount = allSortedDiseases.slice(4).reduce((acc, [_, count]) => acc + count, 0); 
      if (otherCount > 0) {
        sortedDiseases.push(['Other', otherCount]);
      }

      const results = sortedDiseases.map(([name, count]) => {
        return plainToInstance(GetMonthlyDiseasesResponseDto, {
          diseaseName: name,
          count,
        })
      });

      return results;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'An error occurred during processing; failed to retrieve statistic disease.');
    }
  }
}
