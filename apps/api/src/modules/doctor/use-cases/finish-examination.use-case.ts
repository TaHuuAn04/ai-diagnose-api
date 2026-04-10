import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAppointmentRepository, IConsultationRepository, IDiagnosisResultRepository } from 'apps/api/src/core/repository';

import { AppointmentStatus } from '@app/core/domain/enums';
import { BadRequestException, ExceptionHandler, NotFoundException } from '@app/core/exception';

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
  ) {}

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

      // Save diagnosis result
      await this.diagnosisResultRepository.create({
        consultationId: consultation.id,
        description: payload.finalDiagnosis,
        department: payload.department,
        symstomsText: payload.currentCondition || '',
        prescription: payload.medicines?.map(m => ({
          name: m.name,
          concentration: '', // Optional or default since UI doesn't have it
          quantity: m.quantity?.toString() || '0', 
          dosage: m.usage || '',
          duration: 0, // Optional or default
        })) || []
      });

    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Failed to finish examination');
    }
  }
}

