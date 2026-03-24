import { Inject, Injectable } from '@nestjs/common';

import {
  AppointmentCalendarRawResult,
  IAppointmentRepository,
  IConsultationRepository,
  IDoctorRepository,
  IImageRepository,
  IWorkingTimeRepository
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { AppointmentStatus, ImageReference, ShowAppointmentCalendarType, SortDirection } from '@app/core/domain/enums';
import { ImageInfoDto, PageDto, PageMetaDto } from '@app/core/dtos';
import { BadRequestException, ExceptionHandler, NotFoundException } from '@app/core/exception';

import { IDoctorService } from '../doctor.interface';
import {
  AppointmentCalendarItemDto,
  DoctorDashboardStatisticsDto,
  GetAppointmentCalendarRequestDto,
  GetAppointmentCalendarResponseDto,
  GetDoctorDashboardRequestDto,
  GetDoctorResponseDto,
  GetListDoctorRequestDto,
  GetPersonalAppointmentsRequestDto,
  GetPersonalAppointmentsResponseDto,
} from '../dtos';

@Injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.WORKING_TIME_REPOSITORY)
    private readonly workingTimeRepository: IWorkingTimeRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.IMAGE_REPOSITORY)
    private readonly imageRepository: IImageRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository
  ) { }

  async getListDoctors(
    request: GetListDoctorRequestDto
  ): Promise<PageDto<GetDoctorResponseDto>> {
    try {
      const { take, page } = request;

      const paginatedResult = await this.doctorRepository.findListDoctors(request);
      const result = paginatedResult.data;

      const pageMeta = new PageMetaDto({
        take,
        page,
        itemCount: paginatedResult.total,
      });

      const doctorDtos = result.map(doctor => {
        if (!doctor.user) {
          throw new Error(`User not found for doctor with id ${doctor.userId}`);
        }
        const doctorMapping = {
          ...doctor,
          id: doctor.user.id,
          firstName: doctor.user.firstName,
          lastName: doctor.user.lastName,
          email: doctor.user.email,
          phoneNumber: doctor.user.phoneNumber,
          role: doctor.user.role,
          gender: doctor.user.gender,
          dateOfBirth: doctor.user.dateOfBirth,
          phoneCode: doctor.user.phoneCode,
          avatarUrl: doctor.user.avatarUrl,
          isOnBoardingCompleted: doctor.user.isOnBoardingCompleted,
        }
        return plainToInstance(GetDoctorResponseDto, doctorMapping);
      }
      );

      return new PageDto<GetDoctorResponseDto>(doctorDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list doctors');
    }
  }

  async getDoctorInfo(doctorId: string): Promise<GetDoctorResponseDto> {
    try {
      const doctor = await this.doctorRepository.findOne({
        where: { userId: doctorId },
        relations: ['user']
      });

      if (!doctor) {
        throw new NotFoundException(`Doctor not found with id ${doctorId}`);
      }

      if (!doctor.user) {
        throw new NotFoundException(`User not found for doctor with id ${doctorId}`);
      }

      return plainToInstance(GetDoctorResponseDto, {
        ...doctor,
        id: doctor.user.id,
        firstName: doctor.user.firstName,
        lastName: doctor.user.lastName,
        email: doctor.user.email,
        phoneNumber: doctor.user.phoneNumber,
        role: doctor.user.role,
        gender: doctor.user.gender,
        phoneCode: doctor.user.phoneCode,
        avatarUrl: doctor.user.avatarUrl,
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting doctor info');
    }
  }

  async getPersonalAppointments(
    doctorId: string,
    request: GetPersonalAppointmentsRequestDto
  ): Promise<PageDto<GetPersonalAppointmentsResponseDto>> {
    try {
      if (!request.startDate || !request.endDate || request.startDate > request.endDate) {
        throw new BadRequestException('Invalid date range: startDate must be before endDate');
      }

      if (request.from && request.to && request.from > request.to) {
        throw new BadRequestException('Invalid time range: from must be before to');
      }

      const result = await this.workingTimeRepository.findDoctorAppointments(doctorId, request);
      const appointments = result.data;

      const pageMeta = new PageMetaDto({
        page: request.page,
        take: request.take,
        itemCount: result.total,
      });

      const appointmentDtos = await Promise.all(appointments.map(async appointment => {
        if (!appointment.appointment) {
          throw new NotFoundException(`Appointment not found`);
        }

        if (!appointment.appointment.patient) {
          throw new NotFoundException(`Patient not found for appointment with id ${appointment.appointment.id}`);
        }

        if (!appointment.appointment.patient.user) {
          throw new NotFoundException(`User infomation is not found for patient with id ${appointment.appointment.patientId}`);
        }

        const patientConsultation = await this.consultationRepository.findOne({
          where: {
            patientId: appointment.appointment.patientId,
          },
          sort: {
            sortBy: 'createdAt',
            sortOrder: SortDirection.DESC
          },
          relations: ['diagnosisResult', 'diagnosisResult.diseases']
        });

        const diseases = patientConsultation ? patientConsultation.diagnosisResult?.diseases?.map((disease: { name: string }) => disease.name)
          : [];
        
        
        const imageEntities = await this.imageRepository.findAll({
          where: {
            referenceId: appointment.appointment.id,
            referenceType: ImageReference.APPOINTMENT,
          },
          sort: {
            sortBy: 'order',
            sortOrder: SortDirection.DESC
          },
        });

        return plainToInstance(GetPersonalAppointmentsResponseDto, {
          date: appointment.date,
          from: appointment.shift?.from,
          to: appointment.shift?.to,
          patientName: appointment.appointment.patient.user.firstName + ' ' + appointment.appointment.patient.user.lastName,
          dateOfBirth: appointment.appointment.patient.user.dateOfBirth,
          phoneNumber: appointment.appointment.patient.user.phoneNumber,
          gender: appointment.appointment.patient.user.gender,
          description: appointment.appointment.description,
          previousDiseases: diseases,
          status: appointment.appointment.status,
          images: plainToInstance(ImageInfoDto, imageEntities.data),
        });
      }));

      return new PageDto<GetPersonalAppointmentsResponseDto>(appointmentDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'An error occurred during processing; failed to retrieve information.');
    }
  }

  async getAppointmentCalendar(
    doctorId: string,
    request: GetAppointmentCalendarRequestDto
  ): Promise<GetAppointmentCalendarResponseDto[]> {
    try {
      if (!request.startDate || !request.endDate || request.startDate > request.endDate) {
        throw new BadRequestException('Invalid date range: startDate must be before endDate');
      }

      if (request.option == ShowAppointmentCalendarType.YEAR) {
        const year = parseInt(request.startDate.substring(0, 4), 10);
        const promises = Array.from({ length: 12 }, (_, i) => i + 1).map((month) =>
          this.appointmentRepository.findAppointmentsForCalendarByYear(doctorId, year, month)
        );

        const yearlySummaries = await Promise.all(promises);

        return yearlySummaries
      }

      const appointmentsResult = await this.appointmentRepository.findAppointmentsForCalendarByMonth(
        doctorId,
        request.startDate,
        request.endDate,
        request.batch ?? 3,
      );

      return this._mapToCalendarResponse(appointmentsResult);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'An error occurred during processing; failed to retrieve appointment calendar.');
    }
  }

  async getAppointmentDates(
    doctorId: string,
    date: string
  ): Promise<GetAppointmentCalendarResponseDto> {
    try {
      const appointmentsResult = await this.appointmentRepository.findAppointmentsForCalendarByMonth(
        doctorId,
        date,
        date
      );

      const appointments = appointmentsResult.entities.map(appointment => {
        return plainToInstance(AppointmentCalendarItemDto, {
          id: appointment.id,
          patientId: appointment.patientId,
          patientName: appointment.patient?.user ? `${appointment.patient.user.firstName || ''} ${appointment.patient.user.lastName || ''}`.trim() : '',
          dateOfBirth: appointment.patient?.user?.dateOfBirth,
          from: appointment.metadata?.from,
          to: appointment.metadata?.to,
          doctorName: appointment.metadata?.doctorName,
          department: appointment.metadata?.department,
          description: appointment.description,
          status: appointment.status,
        })
      });

      return plainToInstance(GetAppointmentCalendarResponseDto, {
        appointments: appointments,
        total: appointments.length,
        date: new Date(date),
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'An error occurred during processing; failed to retrieve appointment dates.');
    }
  }

  private _mapToCalendarResponse(appointmentsResult: AppointmentCalendarRawResult): GetAppointmentCalendarResponseDto[] {
    const totalByApptId = new Map<string, number>(
      appointmentsResult.raw?.map(item => [
        item.appointment_id ?? item.id ?? '',
        parseInt(item.day_total, 10) || 0
      ])
    );

    // Group by date
    const groupedData = appointmentsResult.entities.reduce<Record<string, GetAppointmentCalendarResponseDto>>((acc, appointment) => {
      const dateString = appointment.metadata?.date;
      if (!dateString) return acc;

      if (!(dateString in acc)) {
        acc[dateString] = Object.assign(new GetAppointmentCalendarResponseDto(), {
          date: new Date(dateString),
          total: totalByApptId.get(appointment.id) ?? 0,
          appointments: [],
        });
      }

      const user = appointment.patient?.user;
      const patientName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';

      const itemDto = plainToInstance(AppointmentCalendarItemDto, {
        id: appointment.id,
        patientId: appointment.patientId,
        patientName,
        dateOfBirth: user?.dateOfBirth,
        gender: user?.gender,
        from: appointment.metadata?.from,
        to: appointment.metadata?.to,
        doctorName: appointment.metadata?.doctorName,
        department: appointment.metadata?.department,
        description: appointment.description,
        status: appointment.status,
      });

      acc[dateString].appointments?.push(itemDto);
      return acc;
    }, {});

    return Object.values(groupedData).map(group =>
      plainToInstance(GetAppointmentCalendarResponseDto, group)
    );
  }

  async getDoctorDashboardStatistics(
    doctorId: string,
    input: GetDoctorDashboardRequestDto
  ): Promise<DoctorDashboardStatisticsDto> {
    try {
      const { currentDate, startMonthDate, lastEndMonthDate, lastStartMonthDate, startWeekDate, lastEndWeekDate, lastStartWeekDate } = input;

      const [currentMonthAppointmentsCount, previousMonthAppointmentsCount, currentWeekPatientsCount, previousWeekPatientsCount, appointments] = await Promise.all([
        this.appointmentRepository.countPeriodExaminedAppointments(
          doctorId,
          startMonthDate,
          currentDate,
        ),
        this.appointmentRepository.countPeriodExaminedAppointments(
          doctorId,
          lastStartMonthDate,
          lastEndMonthDate,
        ),
        this.appointmentRepository.countDistinctPatientsInPeriodExaminedAppointments(
          doctorId,
          startWeekDate,
          currentDate,
        ),
        this.appointmentRepository.countDistinctPatientsInPeriodExaminedAppointments(
          doctorId,
          lastStartWeekDate,
          lastEndWeekDate,
        ),
        this.appointmentRepository.findAll({
          where: {
            metadata: {
              jsonContains: {
                date: currentDate,
                doctorId
              }
            }
          },
          relations: ['patient', 'patient.user']
        })
      ])

      let examinationsCount = 0;
      let cancelledAppointmentsCount = 0;

      appointments.data.forEach((appointment) => {
        if (appointment.status === AppointmentStatus.CANCELLED) {
          cancelledAppointmentsCount++;
        } else if (appointment.status === AppointmentStatus.EXAMINING || appointment.status === AppointmentStatus.EXAMINED) {
          examinationsCount++;
        }
      });
      const totalAppointmentsCount = appointments.data.length - cancelledAppointmentsCount;

      return plainToInstance(DoctorDashboardStatisticsDto, {
        examinationsCount,
        totalAppointmentsCount,
        cancelledAppointmentsCount,
        currentMonthAppointmentsCount,
        previousMonthAppointmentsCount,
        currentWeekPatientsCount,
        previousWeekPatientsCount,
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'An error occurred during processing; failed to retrieve information.');
    }
  }
}