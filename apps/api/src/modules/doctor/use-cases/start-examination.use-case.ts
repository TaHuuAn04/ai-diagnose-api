import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';

import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAppointmentRepository, IConsultationRepository } from 'apps/api/src/core/repository';

import { AppointmentStatus } from '@app/core/domain/enums';
import { BadRequestException, ExceptionHandler, ForbiddenException, NotFoundException } from '@app/core/exception';

export class StartExaminationCommand implements ICommand {
  constructor(
    public readonly doctorId: string,
    public readonly appointmentId: string,
    public readonly patientId: string
  ) {}
}

@CommandHandler(StartExaminationCommand)
export class StartExaminationCommandHandler
  implements ICommandHandler<StartExaminationCommand, string> // Returns consultationId
{
  private readonly logger = new Logger(StartExaminationCommandHandler.name);

  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,
  ) {}

  private static formatLocalTimeWithOffset(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    const offsetMinutes = -date.getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const offsetHours = pad(Math.floor(absOffset / 60));
    const offsetMins = pad(absOffset % 60);
    return `${hh}:${mm}:${ss}${sign}${offsetHours}:${offsetMins}`;
  }

  async execute(command: StartExaminationCommand): Promise<string> {
    try {
      const { doctorId, appointmentId, patientId } = command;

      const appointment = await this.appointmentRepository.findOne({
        where: { id: appointmentId }
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with id ${appointmentId} not found.`);
      }

      if (appointment.patientId !== patientId) {
        throw new BadRequestException('Appointment does not belong to the given patient.');
      }

      if (appointment.metadata?.doctorId !== doctorId) {
        throw new ForbiddenException('You are not assigned to examine this appointment.');
      }

      if (appointment.status === AppointmentStatus.EXAMINING) {
        const existingConsultation = await this.consultationRepository.findOne({
          where: { appointmentId }
        });
        if (existingConsultation) {
          return existingConsultation.id;
        }
      } else if (appointment.status !== AppointmentStatus.SCHEDULED) {
        throw new BadRequestException(`Cannot start examination for appointment with status ${appointment.status}`);
      }

      // 1. Update appointment status
      await this.appointmentRepository.update(appointmentId, {
        status: AppointmentStatus.EXAMINING
      });

      // 2. Create Consultation
      const timeWithTZ = StartExaminationCommandHandler.formatLocalTimeWithOffset(new Date());

      const newConsultation = await this.consultationRepository.create({
        appointmentId,
        patientId,
        doctorId,
        startTime: timeWithTZ,
      });

      return newConsultation.id;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Failed to start examination');
    }
  }
}
