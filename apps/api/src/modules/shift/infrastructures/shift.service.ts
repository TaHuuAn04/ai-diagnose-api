import { Inject, Injectable } from '@nestjs/common';

import {
  IAppointmentRepository,
  IDoctorRepository,
  IImageRepository,
  IPatientRepository,
  IScheduleRepository,
  IShiftRepository,
  IWorkingTimeRepository,
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { AppointmentMetadata } from '@app/core/domain/entities';
import { AppointmentStatus, ImageReference, ImageType, WorkingTimeStatus } from '@app/core/domain/enums';
import { PageDto, PageMetaDto, PageOptionsDto } from '@app/core/dtos';
import { BadRequestException, ExceptionHandler, NotFoundException } from '@app/core/exception';
import { filesToBase64 } from '@app/utils';

import { GetConsultingRoomDto } from '../../appointment/dtos';
import { BookShiftRequestDto } from '../dtos/requests/book-shift.request.dto';
import { GetShiftsByDoctorIdRequestDto } from '../dtos/requests/get-available-shifts.request.dto';
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

    @Inject(REPOSITORY_INJECTION_TOKEN.SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository,
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

  async getShiftsByDoctor(
    doctorId: string,
    input: GetShiftsByDoctorIdRequestDto
  ): Promise<PageDto<AvailableShiftResponseDto>> {
    try {
      const { take, page } = input;

      if (input.startDate && input.endDate && input.startDate > input.endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      const [workingTimes, total] = await Promise.all([
        this.workingTimeRepository.findShiftsByDoctor(
          doctorId,
          input
        ),
        this.workingTimeRepository.countShiftsByDoctor(
          doctorId,
          input
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

      // Validate if the patient has fully completed their profile
      const patientInfo = await this.patientRepository.findOne({
        where: { userId: patientId },
        relations: ['user'],
      });
      if (!patientInfo || patientInfo.user === null) {
        throw new NotFoundException('Patient not found for ' + patientId);
      }
      if (
        !patientInfo.user?.dateOfBirth ||
        !patientInfo.citizenCode ||
        !patientInfo.address ||
        !patientInfo.folk ||
        !patientInfo.medicalInsurance
      ) {
        throw new BadRequestException('Patient profile is not fully completed. Please complete your profile before booking a shift.');
      }

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

      const doctorInfo = await this.doctorRepository.findOne({
        where: { userId: doctorId },
        relations: ['user'],
      });
      if (!doctorInfo || doctorInfo.user === null) {
        throw new NotFoundException('Doctor not found for ' + doctorId);
      }

      const shiftInfo = await this.shiftRepository.findOne({
        where: { id: shiftId },
      });
      if (!shiftInfo) {
        throw new NotFoundException('Shift not found for ' + shiftId);
      }

      const roomFinderInput = plainToInstance(GetConsultingRoomDto, {
        doctorId,
        date: shiftInfo.date,
        timeStart: shiftInfo.from,
        timeEnd: shiftInfo.to,
      });
      const roomNumber = await this.scheduleRepository.findRoomByDoctorAndShift(roomFinderInput);
      if (!roomNumber) {
        throw new NotFoundException(`Room not found for shift with id ${shiftId}`);
      }

      const metadata = plainToInstance(AppointmentMetadata, {
        doctorId,
        doctorName: `${doctorInfo.user?.firstName ?? ''} ${doctorInfo.user?.lastName ?? ''}`,
        department: doctorInfo.department,
        date: shiftInfo.date,
        from: shiftInfo.from,
        to: shiftInfo.to,
        room: roomNumber,
      });

      const appointment = await this.appointmentRepository.create({
        patientId,
        description: description ?? '',
        metadata: metadata,
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
          base64: img.base64,
          fileName: img.fileName,
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
        appointmentStatus: AppointmentStatus.SCHEDULED,
        workingTimeStatus: WorkingTimeStatus.BOOKED,
        description: description ?? '',
        message: 'Shift booked successfully',
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error booking shift');
    }
  }
}

