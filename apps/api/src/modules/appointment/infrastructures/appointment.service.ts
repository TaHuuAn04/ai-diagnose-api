import { Inject, Injectable } from '@nestjs/common';

import { IAppointmentRepository, IImageRepository, IScheduleRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { ImageReference, SortDirection } from '@app/core/domain/enums';
import { ImageInfoDto, PageDto, PageMetaDto } from '@app/core/dtos';
import { ExceptionHandler, NotFoundException } from '@app/core/exception';

import { GetAppointmentResponseDto, GetConsultingRoomDto, GetListAppointmentDto } from '../dtos';
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
  ) {}

  async getListAppointment(
    userId: string,
    request: GetListAppointmentDto
  ): Promise<PageDto<GetAppointmentResponseDto>> {
    try {

      const appointments = await this.appointmentRepository.findListAppointments(userId, request);

      const pageMeta = new PageMetaDto({
        take: request.take,
        page: request.page,
        itemCount: appointments.length,
      });

      const appointmentDtos = await Promise.all(appointments.map(async appointment => {
        if (!appointment.workingTime) {
          throw new NotFoundException(`WorkingTime not found for appointment with id ${appointment.id}`);
        }
        if (!appointment.workingTime.doctor) {
          throw new NotFoundException(`Doctor not found for WorkingTime with id ${appointment.workingTime.doctorId}`);
        }
        if (!appointment.workingTime.shift) {
          throw new NotFoundException(`Shift not found for WorkingTime with id ${appointment.workingTime.shiftId}`);
        }
        if (!appointment.workingTime.doctor.user) {
          throw new NotFoundException(`User not found for Doctor with id ${appointment.workingTime.doctor.userId}`);
        }
        
        const appointmentShortInfo = plainToInstance(GetConsultingRoomDto, {
          doctorId: appointment.workingTime.doctorId,
          date: appointment.workingTime.shift.date,
          timeStart: appointment.workingTime.shift.from,
          timeEnd: appointment.workingTime.shift.to,
        });
        const roomNumber = await this.scheduleRepository.findRoomByDoctorAndShift(appointmentShortInfo);
        if (!roomNumber) {
          throw new NotFoundException(`Room not found for appointment with id ${appointment.id}`);
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
          doctorName: `${appointment.workingTime.doctor.user.firstName} ${appointment.workingTime.doctor.user.lastName}`,
          department: appointment.workingTime.doctor.department,
          date: appointment.workingTime.shift.date,
          from: appointment.workingTime.shift.from,
          to: appointment.workingTime.shift.to,
          room: roomNumber,
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
}
