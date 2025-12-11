import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { IAppointmentRepository, IWorkingTimeRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { AppointmentStatus, WorkingTimeStatus } from '@app/core/domain/enums';
import { PageDto, PageMetaDto, PageOptionsDto } from '@app/core/dtos';
import { ExceptionHandler } from '@app/core/exception';

import { BookShiftRequestDto } from '../dtos/requests/book-shift.request.dto';
import { GetListShiftResponseDto } from '../dtos/response';
import { AvailableShiftResponseDto } from '../dtos/response/available-shift.response.dto';
import { BookShiftResponseDto } from '../dtos/response/book-shift.response.dto';
import { IShiftService } from '../interfaces';

@Injectable()
export class ShiftService implements IShiftService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.WORKING_TIME_REPOSITORY)
    private readonly workingTimeRepository: IWorkingTimeRepository,
    @Inject(REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository
  ) {}

  async getListShifts(
    pageOptionsDto: PageOptionsDto
  ) : Promise<PageDto<GetListShiftResponseDto>> {
    try {
      const { take, page } = pageOptionsDto;

      // Use findAll with QueryOptions for better querying
      const result = await this.workingTimeRepository.findAll({
        pagination: {
          page,
          limit: take,
        },
        relations: ['shift', 'doctor'],
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
      const { doctorId, shiftId, patientId, description } = bookShiftDto;

      const workingTime = await this.workingTimeRepository.findOne({
        doctorId,
        shiftId,
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
        status: AppointmentStatus.PENDING,
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

