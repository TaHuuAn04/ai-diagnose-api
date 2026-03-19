import { Inject, Injectable } from '@nestjs/common';

import { IAppointmentRepository, IImageRepository, IScheduleRepository, IWorkingTimeRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { AppointmentStatus, ImageReference, ImageType, SortDirection, WorkingTimeStatus } from '@app/core/domain/enums';
import { ImageInfoDto, PageDto, PageMetaDto } from '@app/core/dtos';
import { BadRequestException, ExceptionHandler, InternalServerErrorException, NotFoundException } from '@app/core/exception';
import { filesToBase64 } from '@app/utils';

import { UpdateOrDeleteResponseDto } from '../../../common/dtos';
import { GetAppointmentResponseDto, GetListAppointmentDto, UpdateAppointmentDto } from '../dtos';
import { IAppointmentService } from '../interfaces';

@Injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.WORKING_TIME_REPOSITORY)
    private readonly workingTimeRepository: IWorkingTimeRepository,
  ) {}

  async getListAppointment(
    userId: string,
    request: GetListAppointmentDto
  ): Promise<PageDto<GetAppointmentResponseDto>> {
    try {
      const paginatedResult = await this.appointmentRepository.findListAppointments(userId, request);
      const appointments = paginatedResult.data;

      const pageMeta = new PageMetaDto({
        take: request.take,
        page: request.page,
        itemCount: paginatedResult.total,
      });

      const appointmentDtos = await Promise.all(appointments.map(async appointment => {      
        if (!appointment.metadata) {
          throw new InternalServerErrorException(`Metadata is lost for appointment with id ${appointment.id}`);
        }

        const imageEntities = await this.imageRepository.findAll({
          where: {
            referenceId: appointment.id,
            referenceType: ImageReference.APPOINTMENT,
          },
          sort: { 
            sortBy: 'order',
            sortOrder: SortDirection.DESC
          },
        });  
      
        const appointmentMapping = {
          ...appointment,
          id: appointment.id,
          doctorName: appointment.metadata.doctorName,
          department: appointment.metadata.department,
          date: appointment.metadata.date,
          from: appointment.metadata.from,
          to: appointment.metadata.to,
          room: appointment.metadata.room,
          status: appointment.status,
          description: appointment.description,
          images: plainToInstance(ImageInfoDto, imageEntities.data),
        };
        return plainToInstance(GetAppointmentResponseDto, appointmentMapping);
      }));
      
      return new PageDto<GetAppointmentResponseDto>(appointmentDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list of appointments');
    }
  }

  async getUpcomingAppointment(
    userId: string
  ): Promise<GetAppointmentResponseDto | null> {
    try {
      const appointment = await this.appointmentRepository.findUpcomingAppointment(userId);

      if (!appointment) {
        return null;
      }

      if (!appointment.metadata) {
        throw new InternalServerErrorException(`Metadata is lost for appointment with id ${appointment.id}`);
      }

      return plainToInstance(GetAppointmentResponseDto, {
        ...appointment,
        date: appointment.metadata.date,
        from: appointment.metadata.from,
        doctorName: appointment.metadata.doctorName,
        department: appointment.metadata.department,
        room: appointment.metadata.room
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting upcoming appointment');
    }
  }

  @Transactional()
  async updateAppointment(
    appointmentId: string,
    input: UpdateAppointmentDto
  ): Promise<UpdateOrDeleteResponseDto> {
    try {
      const { images, description } = input;

      const appointment = await this.appointmentRepository.findOne({
        where: { id: appointmentId }
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
      }

      appointment.description = description ?? appointment.description;
      if (images) {
        await this.imageRepository.deleteMany({
          referenceId: appointmentId,
          referenceType: ImageReference.APPOINTMENT,
        }); 
        const newImages = filesToBase64(images);
        await this.imageRepository.createMany(
          newImages.map((img, index) => ({
            referenceId: appointmentId,
            referenceType: ImageReference.APPOINTMENT,
            base64: img.base64,
            fileName: img.fileName,
            order: index + 1,
            type: ImageType.PATIENT_SYMPTOMS
          }))
        );
      }

      const updatedAppointment = await this.appointmentRepository.update(appointmentId, appointment);

      return plainToInstance(UpdateOrDeleteResponseDto, {
        isSuccess: true,
        message: 'Appointment updated successfully',
        at: updatedAppointment.updatedAt
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error updating appointment');
    }
  }

  async cancelAppointment(
    appointmentId: string
  ): Promise<UpdateOrDeleteResponseDto> {
    try {
      const appointment = await this.appointmentRepository.findOne({
        where: { id: appointmentId }
      });

      if (!appointment) {
        throw new NotFoundException(`Appointment with id ${appointmentId} not found`);
      }

      const workingTime = await this.workingTimeRepository.updateMany(
        { appointmentId: appointmentId },
        {
          appointmentId: null,
          status: WorkingTimeStatus.AVAILABLE
        }
      )

      if (!workingTime) {
        throw new BadRequestException('Failed to cancel appointment');
      }
      
      if (appointment.status === AppointmentStatus.SCHEDULED) {
        appointment.status = AppointmentStatus.CANCELLED;
      } else {
        throw new BadRequestException('Only appointments with status SCHEDULED can be cancelled');
      }
      const updatedAppointment = await this.appointmentRepository.update(appointmentId, appointment);

      return plainToInstance(UpdateOrDeleteResponseDto, {
        isSuccess: true,
        message: 'Appointment cancelled successfully',
        at: updatedAppointment.updatedAt
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error cancelling appointment');
    }
  }
}
