import { Inject, Injectable } from '@nestjs/common';

import { IAppointmentRepository, IImageRepository, IShiftRepository, IWorkingTimeRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { AppointmentStatus, ImageReference, ImageType, WorkingTimeStatus } from '@app/core/domain/enums';
import { PageDto, PageMetaDto, PageOptionsDto } from '@app/core/dtos';
import { BadRequestException, ExceptionHandler } from '@app/core/exception';
import { filesToBase64 } from '@app/utils';

import { BookShiftRequestDto } from '../dtos/requests/book-shift.request.dto';
import { GetListShiftResponseDto } from '../dtos/response';
import { AvailableShiftResponseDto } from '../dtos/response/available-shift.response.dto';
import { BookShiftResponseDto } from '../dtos/response/book-shift.response.dto';
import { IShiftService } from '../interfaces';

@Injectable()
export class ShiftService implements IShiftService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.SHIFT_REPOSITORY)
    private readonly shiftRepository: IShiftRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.WORKING_TIME_REPOSITORY)
    private readonly workingTimeRepository: IWorkingTimeRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,
  ) {}

  async getListShifts(
    pageOptionsDto: PageOptionsDto
  ) : Promise<PageDto<GetListShiftResponseDto>> {
    try {
      const { take, page } = pageOptionsDto;

      // Use findAll with QueryOptions for better querying
      const result = await this.shiftRepository.findAll({
        pagination: {
          page,
          limit: take,
        },
      });

      const pageMeta = new PageMetaDto({
        take,
        page,
        itemCount: result.meta?.total ?? 0,
      });

      const shiftDtos = result.data.map(shift => 
        plainToInstance(GetListShiftResponseDto, shift)
      );

      return new PageDto<GetListShiftResponseDto>(shiftDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list shifts');
    }
  }

  async getAvailableShiftsByDoctor(
    doctorId: string,
    startDate?: string,
    endDate?: string,
    pageOptionsDto?: PageOptionsDto
  ): Promise<PageDto<AvailableShiftResponseDto>> {
    try {
      const { take, page } = pageOptionsDto ?? { take: 10, page: 1 };

      const [workingTimes, total] = await Promise.all([
        this.workingTimeRepository.findAvailableShiftsByDoctor(
          doctorId,
          startDate,
          endDate,
          pageOptionsDto
        ),
        this.workingTimeRepository.countAvailableShiftsByDoctor(
          doctorId,
          startDate,
          endDate
        ),
      ]);

      const pageMeta = new PageMetaDto({
        take,
        page,
        itemCount: total,
      });

      const availableShiftDtos = workingTimes.map(workingTime => 
        plainToInstance(AvailableShiftResponseDto, workingTime, { excludeExtraneousValues: true })
      );

      return new PageDto<AvailableShiftResponseDto>(availableShiftDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting available shifts by doctor');
    }
  }

  @Transactional()
  async bookShift(bookShiftDto: BookShiftRequestDto): Promise<BookShiftResponseDto> {
    try {
      const { doctorId, shiftId, patientId, images, description } = bookShiftDto;

      const workingTime = await this.workingTimeRepository.findOne({
        where: { 
          doctorId: doctorId,
          shiftId: shiftId,
        },
      });

      if (!workingTime) {
        throw new BadRequestException('This shift is not available for the selected doctor');
      }

      if (workingTime.status !== WorkingTimeStatus.AVAILABLE) {
        throw new BadRequestException('This shift has already been booked');
      }

      const appointment = await this.appointmentRepository.create({
        patientId,
        description: description ?? '',
        status: AppointmentStatus.SCHEDULED,
      });

      const updatedWorkingTimes = await this.workingTimeRepository.updateMany(
        { doctorId, shiftId },
        {
          appointmentId: appointment.id,
          status: WorkingTimeStatus.BOOKED,
        }
      );

      if (!updatedWorkingTimes) {
        throw new BadRequestException('Failed to book shift');
      }

      const imageBase64s = filesToBase64(images)
      await this.imageRepository.createMany(
        imageBase64s.map((img, index) => ({
          referenceId: appointment.id,
          referenceType: ImageReference.APPOINTMENT,
          base64: img,
          order: index + 1,
          type: ImageType.PATIENT_SYMPTOMS
        }))
      );

      return plainToInstance(BookShiftResponseDto, {
        appointmentId: appointment.id,
        workingTimeId: `${doctorId}-${shiftId}`,
        doctorId,
        patientId,
        shiftId,
        appointmentStatus: AppointmentStatus.PENDING,
        workingTimeStatus: WorkingTimeStatus.BOOKED,
        description: description ?? '',
        message: 'Shift booked successfully',
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error booking shift');
    }
  }
}

