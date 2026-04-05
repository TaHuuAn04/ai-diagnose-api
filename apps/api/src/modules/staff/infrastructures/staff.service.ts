import { Inject, Injectable } from '@nestjs/common';

import {
  IAdmissionStaffRepository,
  IAppointmentRepository,
  IDoctorRepository,
  IScheduleRepository,
  IWorkingTimeRepository
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { ActiveStatus, AppointmentStatus } from '@app/core/domain/enums';
import { PageDto, PageMetaDto } from '@app/core/dtos';
import { ExceptionHandler, NotFoundException } from '@app/core/exception';

import {
  GetActiveDoctorsResponseDto,
  GetListAppointmentsRequestDto,
  GetListAppointmentsResponseDto,
  GetScheduleRequestDto, GetScheduleResponseDto, GetTodayAppointmentsRequestDto,
  GetTodayAppointmentsResponseDto,
  NearestEmptyShiftInfo,
  StaffDashboardStatisticsDto
} from '../dtos';
import { IStaffService } from '../interfaces';

@Injectable()
export class StaffService implements IStaffService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.ADMISSION_STAFF_REPOSITORY)
    private readonly admissionStaffRepository: IAdmissionStaffRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.SCHEDULE_REPOSITORY)
    private readonly scheduleRepository: IScheduleRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.WORKING_TIME_REPOSITORY)
    private readonly workingTimeRepository: IWorkingTimeRepository,
  ) {}

  async getTodayAppointments(
    staffId: string,
    request: GetTodayAppointmentsRequestDto
  ): Promise<GetTodayAppointmentsResponseDto[]> {
    try {
      const { currentDate, from } = request;
      
      const staff = await this.admissionStaffRepository.findOne({
        where: { userId: staffId },
      });

      if (!staff) {
        throw new NotFoundException(`Staff not found with id ${staffId}`);
      }

      const appointments = await this.appointmentRepository.findTodayAppointmentsForStaff(
        staff.department,
        currentDate,
        from
      );

      const appointmentDtos = appointments.map((appointment) => {
        if (!appointment.patient?.user) {
          throw new NotFoundException(`Patient not found with id ${appointment.patientId}`);
        }

        return {
          from: appointment.metadata?.from,
          to: appointment.metadata?.to,
          patientName: appointment.patient.user.lastName + " " + appointment.patient.user.firstName,
          gender: appointment.patient.user.gender,
          phoneNumber: appointment.patient.user.phoneNumber,
          doctorName: appointment.metadata?.doctorName,
          status: appointment.status
        }
      })

      return plainToInstance(GetTodayAppointmentsResponseDto, appointmentDtos)

    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list appointments');
    }
  }

  async getListAppointments(
    request: GetListAppointmentsRequestDto
  ): Promise<PageDto<GetListAppointmentsResponseDto>> {
    try {
      const appointments = await this.appointmentRepository.findListAppointmentsForStaff(request);

      const pageMeta = new PageMetaDto ({
        page: request.page,
        take: request.take,
        itemCount: appointments.total,
      });

      const appointmentDtos = appointments.data.map((appointment) => {
        if (!appointment.patient?.user) {
          throw new NotFoundException(`Patient not found with id ${appointment.patientId}`);
        }

        return plainToInstance(GetListAppointmentsResponseDto, {
          appointmentId: appointment.id,
          date: appointment.metadata?.date,
          from: appointment.metadata?.from,
          to: appointment.metadata?.to,
          patientName: appointment.patient.user.lastName + " " + appointment.patient.user.firstName,
          gender: appointment.patient.user.gender,
          phoneNumber: appointment.patient.user.phoneNumber,
          doctorName: appointment.metadata?.doctorName,
          department: appointment.metadata?.department,
          status: appointment.status,
          note: appointment.note,
          description: appointment.description
        })
      })

      return new PageDto<GetListAppointmentsResponseDto>(appointmentDtos, pageMeta)
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list appointments');
    }
  }

  async getActiveDoctors(
    staffId: string,
    date: string
  ): Promise<GetActiveDoctorsResponseDto[]> {
    try {
      const staff = await this.admissionStaffRepository.findOne({
        where: { userId: staffId },
      });

      if (!staff) {
        throw new NotFoundException(`Staff not found with id ${staffId}`);
      }

      const doctors = await this.doctorRepository.findActiveDoctors(
        staff.department,
        date
      );

      const doctorMap = new Map<string, GetActiveDoctorsResponseDto>();

      doctors.forEach((doctor) => {
        const doctorName = `${doctor.user?.lastName ?? ''} ${doctor.user?.firstName ?? ''}`.trim();

        if (!doctor.workingTime || doctor.workingTime.length === 0 ) {
          if (!doctorMap.has(doctor.userId)) {
            doctorMap.set(doctor.userId, {
              doctorId: doctor.userId,
              doctorName,
              department: doctor.department,
              status: ActiveStatus.NO_WORKING,
            });
          }
          return;
        }

        if (doctor.workingTime.every((wt) => wt.appointment === null)) {
          if (!doctorMap.has(doctor.userId)) {
            doctorMap.set(doctor.userId, {
              doctorId: doctor.userId,
              doctorName,
              department: doctor.department,
              status: ActiveStatus.OFF_DUTY,
            });
          }
          return;
        }

        const isExamining = doctor.workingTime.some(
          (wt) => wt.appointment?.status === AppointmentStatus.EXAMINING
        );

        if (!doctorMap.has(doctor.userId)) {
          doctorMap.set(doctor.userId, {
            doctorId: doctor.userId,
            doctorName,
            department: doctor.department,
            status: isExamining ? ActiveStatus.EXAMINING : ActiveStatus.ON_DUTY,
          });
        } else if (isExamining) {
          const existing = doctorMap.get(doctor.userId);
          if (existing) {
            existing.status = ActiveStatus.EXAMINING;
          }
        }
      });

      return plainToInstance(GetActiveDoctorsResponseDto, Array.from(doctorMap.values()));
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting active doctors');
    }
  }

  async getStaffInfoDashboard(
    staffId: string,
    request: GetTodayAppointmentsRequestDto
  ): Promise<StaffDashboardStatisticsDto> {
    try {
      const staff = await this.admissionStaffRepository.findOne({
        where: { userId: staffId },
      });
      if (!staff) {
        throw new NotFoundException(`Staff not found with id ${staffId}`);
      }
      const { currentDate } = request;

      // Get today appointments count
      const todayAppointmentsCount = await this.appointmentRepository.count({
        metadata: {
          jsonContains: {
            date: currentDate,
            department: staff.department
          }
        },
        status: {
          in: [AppointmentStatus.SCHEDULED, AppointmentStatus.EXAMINED]
        }
      });

      // Get nearest empty shifts
      const emptyShifts = await this.workingTimeRepository.findAvailableShifts(
        staff.department,
        request
      )

      // Lấy ra 3 ca trống gần nhất (3 giá trị shift.from distinct nhỏ nhất)
      const top3FromValues = [...new Set(emptyShifts.map(s => s.shift?.from))].slice(0, 3);
      const nearestEmptyShifts = emptyShifts.filter(s => top3FromValues.includes(s.shift?.from));

      const shiftMap = new Map<string, NearestEmptyShiftInfo>();

      nearestEmptyShifts.forEach((wt) => {
        if (!wt.doctor?.user) {
          throw new NotFoundException(`Doctor info not found with id ${wt.doctorId}`);
        }
        if (!wt.shift) {
          throw new NotFoundException(`Shift not found with id ${wt.shiftId}`);
        }

        const doctorName = wt.doctor.user.lastName + " " + wt.doctor.user.firstName;

        if (shiftMap.has(wt.shiftId)) {
          shiftMap.get(wt.shiftId)?.doctorName.push(doctorName);
        } else {
          const nearestShifts = plainToInstance(NearestEmptyShiftInfo, {
            shiftId: wt.shiftId,
            startTime: wt.shift.from,
            doctorName: [doctorName],
          });
          shiftMap.set(wt.shiftId, nearestShifts);
        }
      });

      const nearestEmptyShiftsDto = Array.from(shiftMap.values());

      return plainToInstance(StaffDashboardStatisticsDto, {
        todayAppointmentsCount,
        shifts: nearestEmptyShiftsDto
      })
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting staff info dashboard');
    }
  }

  async getScheduleInfo(
    staffId: string,
    request: GetScheduleRequestDto
  ): Promise<GetScheduleResponseDto[]> {
    try {
      const staff = await this.admissionStaffRepository.findOne({
        where: { userId: staffId },
      });
      if (!staff) {
        throw new NotFoundException(`Staff not found with id ${staffId}`);
      }

      const schedules = await this.scheduleRepository.findSchedulesWithDepartmentForStaff(
        staff.department,
        request
      )

      const scheduleDtos = schedules.map((schedule) => {
        if (!schedule.doctor?.user) {
          throw new NotFoundException(`Doctor not found in schedule with id ${schedule.id} or information not found`);
        }

        return {
          scheduleId: schedule.id,
          doctorId: schedule.doctorId,
          date: schedule.date,
          from: schedule.from,
          to: schedule.to,
          room: schedule.room,
          doctorName: `${schedule.doctor.user.lastName} ${schedule.doctor.user.firstName}`,
        };
      });

      return plainToInstance(GetScheduleResponseDto, scheduleDtos);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting schedule info');
    }
  }
}
