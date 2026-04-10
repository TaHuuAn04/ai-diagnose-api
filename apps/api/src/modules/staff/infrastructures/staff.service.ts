import { Readable } from 'stream';

import { Inject, Injectable } from '@nestjs/common';

import {
  IAdmissionStaffRepository,
  IAppointmentRepository,
  IDoctorRepository,
  IScheduleRepository,
  IShiftRepository,
  IWorkingTimeRepository
} from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { format } from '@fast-csv/format';
import { parse } from '@fast-csv/parse';
import { UpdateOrDeleteResponseDto } from 'apps/api/src/common/dtos';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { ScheduleEntity, WorkingTimeEntity } from '@app/core/domain/entities';
import { ActiveStatus, AppointmentStatus , WorkingTimeStatus } from '@app/core/domain/enums';
import { PageDto, PageMetaDto } from '@app/core/dtos';
import { BadRequestException, ExceptionHandler, InternalServerErrorException, NotFoundException} from '@app/core/exception';

import {
  CreateScheduleRequestDto,
  DeleteScheduleRequestDto,
  ExportScheduleToCSVResponseDto,
  GetActiveDoctorsResponseDto,
  GetListAppointmentsRequestDto,
  GetListAppointmentsResponseDto,
  GetScheduleRequestDto ,
  GetScheduleResponseDto,
  GetTodayAppointmentsRequestDto,
  GetTodayAppointmentsResponseDto,
  ImportScheduleFromCSVRequestDto,
  NearestEmptyShiftInfo,
  StaffDashboardStatisticsDto,
  UpdateScheduleRequestDto
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

    @Inject(REPOSITORY_INJECTION_TOKEN.SHIFT_REPOSITORY)
    private readonly shiftRepository: IShiftRepository,
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
          throw new NotFoundException(`Doctor not found in schedule with id ${schedule.id} or doctor infomation not found`);
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

  @Transactional()
  async importScheduleFromCSV(
    staffId: string,
    request: ImportScheduleFromCSVRequestDto
  ): Promise<GetScheduleResponseDto[]> {
    try {
      const csvFile = request.file;
      const stream = Readable.from(csvFile.buffer);

      const rows: Record<string, string>[] = await new Promise((resolve, reject) => {
        const results: Record<string, string>[] = [];

        stream
          .pipe(parse({ headers: true, trim: true }))
          .on('data', (row: Record<string, string>) => {
            results.push(row);
          })
          .on('error', (error) => { reject(error); })
          .on('end', () => { resolve(results); });
      });

      // Phase 1: Validate all rows
      const requiredHeaders = ['date', 'from', 'to', 'room', 'doctorCode'];
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^\d{2}:\d{2}:\d{2}\+07$/;

      // Validate headers
      if (rows.length > 0) {
        const headers = Object.keys(rows[0]);
        const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
        if (missingHeaders.length > 0) {
          throw new BadRequestException(`CSV file is missing required columns: ${missingHeaders.join(', ')}`);
        }
      }

      // Validate format & detect duplicates
      const seen = new Set<string>();
      rows.forEach((row, index) => {
        const rowInfo = `Row ${String(index + 1)}: ${row.date}-${row.from}-${row.to}-${row.room}-${row.doctorCode}`;
        const rowKey = `${row.date}|${row.from}|${row.to}|${row.room}|${row.doctorCode}`;

        // Duplicate check
        if (seen.has(rowKey)) {
          throw new BadRequestException(`Duplicate CSV row - ${rowInfo}`);
        }
        seen.add(rowKey);

        // Date format
        if (!dateRegex.test(row.date)) {
          throw new BadRequestException(`Invalid date format (YYYY-mm-dd required) - ${rowInfo}`);
        }

        // Time format
        if (!timeRegex.test(row.from)) {
          throw new BadRequestException(`Invalid 'from' time format (HH:mm:ss+07 required) - ${rowInfo}`);
        }
        if (!timeRegex.test(row.to)) {
          throw new BadRequestException(`Invalid 'to' time format (HH:mm:ss+07 required) - ${rowInfo}`);
        }
      });

      // Validate doctor existence in parallel
      const scheduleRequests = await Promise.all(
        rows.map(async (row, index) => {
          const rowInfo = `Row ${String(index + 1)}: ${row.date}-${row.from}-${row.to}-${row.room}-${row.doctorCode}`;

          const doctor = await this.doctorRepository.findOne({
            where: { doctorCode: row.doctorCode },
          });
          if (!doctor) {
            throw new BadRequestException(`Doctor not found with code ${row.doctorCode} - ${rowInfo}`);
          }

          return plainToInstance(CreateScheduleRequestDto, {
            doctorId: doctor.userId,
            date: row.date,
            from: row.from,
            to: row.to,
            room: row.room,
          });
        })
      );

      // Phase 2: Create schedules sequentially
      const scheduleDtos: GetScheduleResponseDto[] = [];
      for (const scheduleRequest of scheduleRequests) {
        const scheduleDto = await this._createScheduleInternal(staffId, scheduleRequest);
        scheduleDtos.push(plainToInstance(GetScheduleResponseDto, {
          scheduleId: scheduleDto.id,
          doctorId: scheduleDto.doctorId,
          date: scheduleDto.date,
          from: scheduleDto.from,
          to: scheduleDto.to,
          room: scheduleDto.room,
        }));
      }

      return scheduleDtos;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error importing schedule from CSV');
    }
  }
  
  private async _validateScheduleTime(
    doctorId: string,
    date: string,
    request: { from: string; to: string }
  ): Promise<void> {
    if (request.from >= request.to) {
      throw new BadRequestException('Invalid time range');
    }
    const validTimePattern = /^\d{2}:(00|30):00/;
    if (!validTimePattern.test(request.from) || !validTimePattern.test(request.to)) {
      throw new BadRequestException('Time must be on the hour (XX:00:00) or half hour (XX:30:00)');
    }

    const existingSchedule = await this.scheduleRepository.findAll({
      where: {
        doctorId,
        date,
      },
    });

    existingSchedule.data.forEach((schedule) => {
      if (schedule.from <= request.from && schedule.to >= request.to) {
        throw new BadRequestException(`Schedule already exists, existing schedule: ${schedule.doctorId ?? 'unknown'}-${schedule.from}`);
      } 
      if (schedule.from > request.from && schedule.to < request.to) {
        throw new BadRequestException('In a request period that has a schedule with an internal time period, please reselects the time period');
      } else {
        if (request.from < schedule.from) {
          if (request.to > schedule.from ) {
            request.to = schedule.from;
          }
        }
        if (request.to > schedule.to) {
          if (request.from < schedule.to) {
            request.from = schedule.to;
          }
        }
      }
    });

    if (request.from >= request.to) {
      throw new BadRequestException('Invalid time range or the time range after adjust is invalid');
    }
  }

  private async _createScheduleInternal(
    staffId: string,
    request: CreateScheduleRequestDto
  ): Promise<ScheduleEntity> {
    const { doctorId, date, room } = request;
    await this._validateScheduleTime(doctorId, date, request);
    
    const { from, to } = request;
    const schedule = await this.scheduleRepository.create({
        admissionStaffId: staffId,
        doctorId,
        date,
        from,
        to,
        room,
    });

    const shifts = await this.shiftRepository.findAll({
      where: {
        from: {
          gte: from
        },
        to: {
          lte: to
        }
      }
    });

    await this.workingTimeRepository.createMany(
      shifts.data.map((shift) => ({
        doctorId,
        shiftId: shift.id,
        date,
        status: WorkingTimeStatus.AVAILABLE,
      }))
    );

    return schedule;
  }

  private async _deleteScheduleInternal(
    scheduleIds: string[],
    startWeekDate: string,
    endWeekDate: string,
    currentDate: string
  ): Promise<void> {
    const schedule = await this.scheduleRepository.findAll({
      where: {
        id: {
          in: scheduleIds
        }
      }
    });

    if (schedule.data.length === 0) {
      throw new NotFoundException(`Schedule not found with list of id ${scheduleIds.join(', ')}`);
    }
    
    const workingTimesData = (await Promise.all(schedule.data.map(async (schedule) => {
      if (schedule.doctorId === null) {
        throw new NotFoundException(`Schedule is not assigned to any doctor`);
      }

      if (schedule.date < currentDate) {
        throw new BadRequestException(`Schedule date is in the past, the schedule cannot be adjust for schedule with id ${schedule.id}`);
      }

      if (schedule.date >= startWeekDate && schedule.date <= endWeekDate) {
        throw new BadRequestException(`Schedule date is in the week, the schedule cannot be deleted for schedule with id ${schedule.id}`);
      }

      const workingTimes = await this.workingTimeRepository.findWorkingTimesByScheduleInfo(schedule);
      if (workingTimes.some((wt) => wt.status === WorkingTimeStatus.BOOKED)) {
        throw new BadRequestException(`Schedule has appointments, the schedule with id ${schedule.id} cannot be deleted`);
      }

      return workingTimes;
    }))).flat();

    if (workingTimesData.length > 0) {
      await this.workingTimeRepository.deleteManyByObjects(workingTimesData);
    }
    await this.scheduleRepository.deleteMany({
      id: {
        in: scheduleIds
      }
    });
  }

  @Transactional()
  async createSchedule(
    staffId: string,
    request: CreateScheduleRequestDto
  ): Promise<GetScheduleResponseDto> {
    try {
      const schedule = await this._createScheduleInternal(staffId, request);
      const scheduleDto = {
        scheduleId: schedule.id,
        doctorId: schedule.doctorId,
        date: schedule.date,
        from: schedule.from,
        to: schedule.to,
        room: schedule.room,
      };

      return plainToInstance(GetScheduleResponseDto, scheduleDto);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error creating schedule');
    }
  }

  @Transactional()
  async deleteSchedule(
    request: DeleteScheduleRequestDto
  ): Promise<UpdateOrDeleteResponseDto> {
    try {
      const { scheduleIds, startWeekDate, endWeekDate, currentDate } = request;

      await this._deleteScheduleInternal(scheduleIds, startWeekDate, endWeekDate, currentDate);

      return plainToInstance(UpdateOrDeleteResponseDto, {
        isSuccess: true,
        message: 'List of schedules deleted successfully',
        at: new Date().toISOString()
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'An error occurred during processing; failed to delete schedule.');
    }
  }

  @Transactional()
  async updateSchedule(
    staffId: string,
    scheduleId: string,
    request: UpdateScheduleRequestDto
  ): Promise<UpdateOrDeleteResponseDto> {
    try {
      const { startWeekDate, endWeekDate, currentDate } = request;
      if (request.date <= currentDate) {
        throw new BadRequestException(`You cannot update schedule at date that is in the past`);
      }
      const updateSchedule = await this.scheduleRepository.findOne({
        where: {
          id: scheduleId
        }
      });
      if (!updateSchedule) {
        throw new NotFoundException(`Schedule not found with id ${scheduleId}`);
      }

      await this._deleteScheduleInternal([scheduleId], startWeekDate, endWeekDate, currentDate);
      const schedule = await this._createScheduleInternal(staffId, request);

      return plainToInstance(UpdateOrDeleteResponseDto, {
        isSuccess: true,
        message: 'Schedule updated successfully',
        at: schedule.createdAt
      });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'An error occurred during processing; failed to update schedule.');
    }
  }

  async exportScheduleToCSV(
    staffId: string,
    request: GetScheduleRequestDto
  ): Promise<ExportScheduleToCSVResponseDto> {
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

      const csvRows = schedules.map((schedule) => ({
        date: schedule.date,
        from: schedule.from,
        to: schedule.to,
        room: schedule.room,
        doctorCode: schedule.doctor?.doctorCode ?? '',
      }));

      const buffer: Buffer = await new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        const csvStream = format({ headers: true });

        csvStream.on('data', (chunk: Buffer) => chunks.push(chunk));
        csvStream.on('error', (error) => { reject(error); });
        csvStream.on('end', () => { resolve(Buffer.concat(chunks)); });

        csvRows.forEach((row) => csvStream.write(row));
        csvStream.end();
      });

      const fileName = `schedule_${request.startDate}_${request.endDate}.csv`;

      return plainToInstance(ExportScheduleToCSVResponseDto, { buffer, fileName });
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error exporting schedule to CSV');
    }
  }
}