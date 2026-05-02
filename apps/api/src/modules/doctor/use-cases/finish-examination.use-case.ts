import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';


import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAppointmentRepository, IConsultationRepository, IDiagnosisResultRepository, IDiseaseRepository, IResultDiseaseRepository } from 'apps/api/src/core/repository';
import { Transactional } from 'typeorm-transactional';

import { AppointmentStatus } from '@app/core/domain/enums';
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
        prescription: payload.medicines?.map(m => ({
          name: m.name,
          concentration: '',
          quantity: m.quantity.toString(),
          dosage: m.usage,
          duration: 0,
        })) ?? []
      });

      await this.resultDiseaseRepository.create({
        resultId: diagnosisResult.id,
        diseaseId: disease.id,
        name: disease.name
      });

    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Failed to finish examination');
    }
  }
}

