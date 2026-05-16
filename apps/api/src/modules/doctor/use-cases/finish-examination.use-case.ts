import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';


import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAppointmentRepository, IConsultationRepository, IDiagnosisResultRepository, IDiseaseRepository, IImageRepository, IResultDiseaseRepository } from 'apps/api/src/core/repository';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';

import { AppointmentStatus, ImageReference, ImageType } from '@app/core/domain/enums';
import { BadRequestException, ExceptionHandler, InternalServerErrorException, NotFoundException } from '@app/core/exception';

import { FinishExaminationRequestDto } from '../dtos/request/finish-examination.request.dto';

export class FinishExaminationCommand implements ICommand {
  constructor(
    public readonly doctorId: string,
    public readonly payload: FinishExaminationRequestDto
  ) {}
}

@CommandHandler(FinishExaminationCommand)
export class FinishExaminationCommandHandler
  implements ICommandHandler<FinishExaminationCommand, void>
{
  private readonly logger = new Logger(FinishExaminationCommandHandler.name);

  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.DIAGNOSIS_RESULT_REPOSITORY)
    private readonly diagnosisResultRepository: IDiagnosisResultRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.DISEASE_REPOSITORY)
    private readonly diseaseRepository: IDiseaseRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.RESULT_DISEASE_REPOSITORY)
    private readonly resultDiseaseRepository: IResultDiseaseRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,
  ) {}

  @Transactional()
  async execute(command: FinishExaminationCommand): Promise<void> {
    try {
      const { doctorId, payload } = command;

      const consultation = await this.consultationRepository.findOne({
        where: { id: payload.consultationId }
      });

      if (!consultation) {
        throw new NotFoundException(`Consultation with id ${payload.consultationId} not found`);
      }

      if (consultation.doctorId !== doctorId) {
        throw new BadRequestException('Consultation does not belong to you');
      }

      const appointment = await this.appointmentRepository.findOne({
        where: { id: consultation.appointmentId }
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment not found`);
      }

      // Update appointment status
      await this.appointmentRepository.update(appointment.id, {
        status: AppointmentStatus.EXAMINED
      });

      // Update consultation endTime
      await this.consultationRepository.update(consultation.id, {
        endTime: new Date().toISOString().split('T')[1]
      });

      // Split multiple diseases by comma if doctor typed "Disease A, Disease B", 
      // but usually it's one. We'll just take the whole string as one disease name for simplicity,
      // or clean it up.
      const diseaseName = payload.finalDiagnosis.trim();
      let disease = await this.diseaseRepository.findOne({
        where: { name: diseaseName }
      });

      disease ??= await this.diseaseRepository.findOne({
        where: { name: 'others'}
      })

      if(!disease) {
        throw new InternalServerErrorException('Disease not found');
      }


      // Save diagnosis result
      const diagnosisResult = await this.diagnosisResultRepository.create({
        consultationId: consultation.id,
        description: payload.currentCondition ?? '',
        department: payload.department,
        symstomsText: payload.finalDiagnosis,
        clinicalInfo: payload.clinicalInfo ?? null,
        advices: payload.doctorAdvice ?? null,
        prescription: payload.medicines?.map(m => ({
          name: m.name,
          concentration: m.concentration,
          quantity: m.quantity.toString(),
          dosage: m.dosage,
          duration: m.usage,
        })) ?? []
      });

      await this.resultDiseaseRepository.create({
        resultId: diagnosisResult.id,
        diseaseId: disease.id,
        name: disease.name
      });

      // Save consultation images (AI-returned images or doctor-uploaded images)
      if (payload.images && payload.images.length > 0) {
        const imageEntities = payload.images.map((base64Data, index) => ({
          referenceId: consultation.id,
          referenceType: ImageReference.CONSULTATION,
          fileName: `consultation_${consultation.id}_${index + 1}.png`,
          base64: base64Data,
          type: ImageType.DOCTOR_SYMPTOMS,
          order: index + 1,
          description: null,
          dataUrl: null,
        }));

        await this.imageRepository.createMany(imageEntities);
        this.logger.log(`Saved ${imageEntities.length} consultation images for consultation ${consultation.id}`);
      }

    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Failed to finish examination');
    }
  }
}

