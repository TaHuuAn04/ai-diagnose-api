import { Inject, Injectable } from '@nestjs/common';

import { ExceptionHandler, NotFoundException } from '@app/core/exception';

import { IStaffService } from '../interfaces';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { IAdmissionStaffRepository, IAppointmentRepository, IDoctorRepository, IScheduleRepository } from '@api/core/repository';
import { GetActiveDoctorsResponseDto, GetScheduleRequestDto, GetScheduleResponseDto, GetTodayAppointmentsRequestDto, GetTodayAppointmentsResponseDto } from '../dtos';
import { ActiveStatus, AppointmentStatus } from '@app/core/domain/enums';
import { plainToInstance } from 'class-transformer';

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
    private readonly scheduleRepository: IScheduleRepository
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
        if (!appointment.patient || !appointment.patient.user) {
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
              doctorName,
              department: doctor.department,
              status: ActiveStatus.OFF_DUTY,
            });
          }
          return;
        }

        const isExamining = doctor.workingTime.some(
          (wt) => wt.appointment?.status === AppointmentStatus.EXAMINING
        ) ?? false;

        if (!doctorMap.has(doctor.userId)) {
          doctorMap.set(doctor.userId, {
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
        if (!schedule.doctor || !schedule.doctor.user) {
          throw new NotFoundException(`Doctor not found with id ${schedule.doctorId}`);
        }

        return {
          scheduleId: schedule.id,
          doctorId: schedule.doctorId,
          date: schedule.date,
          from: schedule.from,
          to: schedule.to,
          room: schedule.room,
          doctorName: schedule.doctor?.user?.lastName + ' ' + schedule.doctor?.user?.firstName,
        };
      });

      return plainToInstance(GetScheduleResponseDto, scheduleDtos);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting schedule info');
    }
  }
}
