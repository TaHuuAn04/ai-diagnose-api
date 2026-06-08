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
import { BadRequestException, ExceptionHandler, NotFoundException } from '@app/core/exception';
import { filesToBase64 } from '@app/utils';

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

  async getListShifts() : Promise<GetListShiftResponseDto[]> {
    try {
      const result = await this.shiftRepository.findAll();

      const shiftDtos = result.data.map(shift => 
        plainToInstance(GetListShiftResponseDto, shift)
      );

      return shiftDtos
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list shifts');
    }
  }

  async getShiftsByDoctor(
    doctorId: string,
    input: GetShiftsByDoctorIdRequestDto
  ): Promise<AvailableShiftResponseDto[]> {
    try {
      if (input.startDate && input.endDate && input.startDate > input.endDate) {
        throw new BadRequestException('Start date must be before end date');
      }
      
      const now = new Date(Date.now() + 7 * 60 * 60 * 1000); 
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toISOString().split('T')[1].substring(0, 8) + '+07'; 

      await this.workingTimeRepository.updatePastWorkingTimesToUnavailable(currentDate, currentTime);

      const { data: workingTimeRecords } = await this.workingTimeRepository.findAll({
        where: {
          doctorId: doctorId,
          date: {
            between: [input.startDate, input.endDate],
          },
          status: input.status
        },
        relations: ['shift'],
        sort: [
          { sortBy: 'date', sortOrder: 'ASC' },
          { 
            sortBy: 'shift', 
            sortOrder: { from: 'ASC' } as any
          }
        ],
      });

      const groupedData = workingTimeRecords.reduce<Record<string, AvailableShiftResponseDto>>((acc, current) => {
        const dateKey = current.date;
        if (!(dateKey in acc)) {
          acc[dateKey] = {
            doctorId: current.doctorId,
            date: dateKey,
            shift: []
          };
        }
        if (current.shift) {
          acc[dateKey].shift.push({
            id: current.shift.id,
            from: current.shift.from,
            to: current.shift.to,
            status: current.status,
          });
        }
        return acc;
      }, {});

      const availableShiftDtos = Object.values(groupedData).map(data => 
        plainToInstance(AvailableShiftResponseDto, data, { excludeExtraneousValues: true })
      );

      return availableShiftDtos;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting available shifts by doctor');
    }
  }

  @Transactional()
  async bookShift(bookShiftDto: BookShiftRequestDto): Promise<BookShiftResponseDto> {
    try {
      const { doctorId, shiftId, patientId, images, description, date } = bookShiftDto;

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

      //Check if the patient has already booked an appointment with another doctor on the same day at the same time
      const conflictAppointment = await this.workingTimeRepository.findWorkingTimeConflict(patientId, shiftId, date);
      if (conflictAppointment) {
        const doctorName = `${conflictAppointment.doctor?.user?.firstName ?? ''} ${conflictAppointment.doctor?.user?.lastName ?? ''}`;
        throw new BadRequestException(`You have already booked an appointment with doctor ${doctorName} on ${date} at the same time.`);
      }

      // Acquire a row-level lock (SELECT ... FOR UPDATE) to prevent concurrent double booking
      const workingTime = await this.workingTimeRepository.findOneForUpdate(
        doctorId,
        shiftId,
        date,
      );

      if (!workingTime) {
        throw new BadRequestException('This shift is not available for the selected doctor');
      }

      if (workingTime.status !== WorkingTimeStatus.AVAILABLE) {
        throw new BadRequestException('This shift has already been booked');
      }

      const roomNumber = await this.scheduleRepository.findOne({
        where: {
          doctorId: doctorId,
          date: workingTime.date,
          from: {
            lte: workingTime.shift?.from,
          },
          to: {
            gte: workingTime.shift?.to,
          },
        },
      });
      if (!roomNumber) {
        throw new NotFoundException(`Room not found for shift with id ${shiftId}`);
      }

      const metadata = plainToInstance(AppointmentMetadata, {
        doctorId,
        doctorName: `${workingTime.doctor?.user?.firstName ?? ''} ${workingTime.doctor?.user?.lastName ?? ''}`,
        department: workingTime.doctor?.department,
        date: workingTime.date,
        from: workingTime.shift?.from,
        to: workingTime.shift?.to,
        room: roomNumber.room,
      });

      const appointment = await this.appointmentRepository.create({
        patientId,
        description: description ?? '',
        metadata: metadata,
        status: AppointmentStatus.SCHEDULED,
      });

      const updatedWorkingTimes = await this.workingTimeRepository.updateMany(
        {
          doctorId: doctorId,
          shiftId: shiftId,
          date: date,
          status: WorkingTimeStatus.AVAILABLE,
        },
        {
          appointmentId: appointment.id,
          status: WorkingTimeStatus.BOOKED,
        }
      );

      if (!updatedWorkingTimes) {
        throw new BadRequestException('Failed to book shift or shift is already booked');
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
        date: workingTime.date,
        room: metadata.room,
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

