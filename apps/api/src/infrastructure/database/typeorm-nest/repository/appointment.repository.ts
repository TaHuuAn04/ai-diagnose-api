import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AppointmentCalendarRawResult, AppointmentRawResult, IAppointmentRepository } from 'apps/api/src/core/repository';
import { GetListAppointmentDto } from 'apps/api/src/modules/appointment/dtos';
import { GetAppointmentCalendarResponseDto, GetPersonalAppointmentsRequestDto } from 'apps/api/src/modules/doctor/dtos';
import { GetListAppointmentsRequestDto } from 'apps/api/src/modules/staff/dtos';
import { plainToInstance } from 'class-transformer';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { AppointmentEntity } from '@app/core/domain/entities';
import { AppointmentStatus, SortDirection } from '@app/core/domain/enums';
import { PaginatedResult } from '@app/core/dtos';

import { Appointment } from '../entities';

import { GenericRepository } from './generic-repository';


@Injectable()
export class AppointmentRepository
  extends GenericRepository<AppointmentEntity, Appointment>
  implements IAppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    public readonly repository: Repository<Appointment>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Appointment): AppointmentEntity => {
        return plainToInstance(AppointmentEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: AppointmentEntity): Appointment => {
        return plainToInstance(Appointment, domainEntity);
      }
    });
  }

  async findListAppointments(
    userId: string,
    request: GetListAppointmentDto
  ): Promise<PaginatedResult<AppointmentEntity>> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.workingTime', 'workingTime')
      .leftJoinAndSelect('workingTime.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .leftJoinAndSelect('workingTime.shift', 'shift')
    
    if (userId) {
      queryBuilder.andWhere('appointment.patientId = :userId', {
        userId: userId,
      });
    }

    if (request.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: request.status });
    }
      
    if (request.keyword) {
      queryBuilder.andWhere(
        `CONCAT(user.firstName, ' ', user.lastName) ILIKE :keyword`,
        { keyword: `%${request.keyword}%` },
      );
    }

    const sortField = request.sort ?? 'updatedAt';
    const sortOrder = request.sortDirection ?? SortDirection.DESC;
    queryBuilder.orderBy(`appointment.${sortField}`, sortOrder as 'ASC' | 'DESC');

    if (request.skip) {
      queryBuilder.skip(request.skip);
    }
    if (request.take) {
      queryBuilder.take(request.take);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();

    const appointments = entities.map(entity => this._mapper.toDomain(entity));

    return plainToInstance(PaginatedResult<AppointmentEntity>, {
      data: appointments,
      total
    });
  }

  async findListAppointmentsForStaff(
    request: GetListAppointmentsRequestDto
  ): Promise<PaginatedResult<AppointmentEntity>> {
    const { fromDate, toDate, from, to, status, doctorId } = request;

    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .andWhere('appointment.metadata->>\'date\' >= :fromDate', { fromDate })
      .andWhere('appointment.metadata->>\'date\' <= :toDate', { toDate })

    if (from) {
      queryBuilder.andWhere('appointment.metadata->>\'from\' >= :from', { from })
    }

    if (to) {
      queryBuilder.andWhere('appointment.metadata->>\'to\' <= :to', { to })
    }

    if (doctorId) {
      queryBuilder.andWhere('appointment.metadata->>\'doctorId\' = :doctorId', { doctorId })
    }

    if (status) {
      queryBuilder.andWhere('appointment.status = :status', { status })
    }

    queryBuilder.leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')
      
    if (request.keyword) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :keyword OR user.lastName ILIKE :keyword OR user.phoneNumber ILIKE :keyword )',
        { keyword: `%${request.keyword}%` }
      );
    }

    const sortOrder = request.sortDirection ?? SortDirection.DESC;
    const sortField = request.sort;

    if (sortField) {
      queryBuilder.orderBy(`appointment.${sortField}`, sortOrder as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy("(appointment.metadata->>'date')", sortOrder as 'ASC' | 'DESC')
        .addOrderBy("(appointment.metadata->>'from')", 'ASC');
    }

    if (request.skip) {
      queryBuilder.offset(request.skip);
    }
    if (request.take) {
      queryBuilder.limit(request.take);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();

    const appointments = entities.map(entity => this._mapper.toDomain(entity));

    return plainToInstance(PaginatedResult<AppointmentEntity>, {
      data: appointments,
      total
    });
  }

  async findUpcomingAppointment(
    userId: string
  ): Promise<AppointmentEntity | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.workingTime', 'workingTime')
      .leftJoinAndSelect('workingTime.shift', 'shift')
      .where('appointment.patientId = :userId', { userId: userId })
      .andWhere('appointment.status NOT IN (:...statuses)', { statuses: [AppointmentStatus.EXAMINED, AppointmentStatus.CANCELLED] })
      .andWhere('workingTime.date + shift.to >= :date', { date: new Date() })
      .orderBy('workingTime.date', 'ASC').addOrderBy('shift.from', 'ASC')

    const entity = await queryBuilder.getOne();

    return entity ? this._mapper.toDomain(entity) : null;
  }

  async countPeriodExaminedAppointments(
    doctorId: string,
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .andWhere('appointment.metadata->>\'doctorId\' = :doctorId', { doctorId })
      .andWhere('appointment.metadata->>\'date\' >= :startDate', { startDate })
      .andWhere('appointment.metadata->>\'date\' <= :endDate', { endDate })
      .andWhere('appointment.status NOT IN (:...statuses)', { statuses: [AppointmentStatus.SCHEDULED, AppointmentStatus.CANCELLED] })
    
    const total = await queryBuilder.getCount();
    return total;
  }

  async findTodayAppointmentsForStaff(
    department: string,
    date: string, 
    from?: string
  ): Promise<AppointmentEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .where('appointment.metadata->>\'department\' = :department', { department })
      .andWhere('appointment.metadata->>\'date\' = :date', { date })
      .andWhere('appointment.status NOT IN (:...statuses)', { statuses: [AppointmentStatus.EXAMINED, AppointmentStatus.CANCELLED] })
      .leftJoinAndSelect('appointment.workingTime', 'workingTime')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')

    if (from) {
      queryBuilder.andWhere('appointment.metadata->>\'from\' >= :from', { from });
      queryBuilder.orderBy('appointment.metadata->>\'from\'', 'ASC');

      // Lấy record đầu tiên để xác định shiftId của ca sớm nhất
      const firstAppointment = await queryBuilder.clone().getOne();

      if (!firstAppointment) {
        return [];
      }

      const targetShiftId = firstAppointment.workingTime?.shiftId;

      // Chỉ lấy những appointment cùng shiftId
      queryBuilder.andWhere('workingTime.shiftId = :shiftId', { shiftId: targetShiftId });
    }

    const entities = await queryBuilder.getMany();

    return entities.map(entity => this._mapper.toDomain(entity));
  }

  async countDistinctPatientsInPeriodExaminedAppointments(
    doctorId: string,
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .select('COUNT(DISTINCT appointment.patientId)', 'count')
      .andWhere('appointment.metadata->>\'doctorId\' = :doctorId', { doctorId })
      .andWhere('appointment.metadata->>\'date\' >= :startDate', { startDate })
      .andWhere('appointment.metadata->>\'date\' <= :endDate', { endDate })
      .andWhere('appointment.status NOT IN (:...statuses)', { statuses: [AppointmentStatus.SCHEDULED, AppointmentStatus.CANCELLED] })

    const rawResult = await queryBuilder.getRawOne();
    return rawResult ? parseInt(rawResult.count, 10) : 0;
  }

  private  _queryAppointmentByDay(
    startDate: string,
    endDate: string,
    doctorId?: string,
    patientId?: string,
    status?: AppointmentStatus 
  ): SelectQueryBuilder<Appointment> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .andWhere('appointment.metadata->>\'date\' >= :startDate', { startDate })
      .andWhere('appointment.metadata->>\'date\' <= :endDate', { endDate })
      .orderBy('appointment.metadata->>\'date\'', 'ASC')
      .addOrderBy('appointment.metadata->>\'from\'', 'ASC');

    if(status) {
      queryBuilder.andWhere('appointment.status = :status', { status });
    }

    if (doctorId) {
      queryBuilder.andWhere('appointment.metadata->>\'doctorId\' = :doctorId', { doctorId });
    }

    if (patientId) {
      queryBuilder.andWhere('appointment.patientId = :patientId', { patientId });
    }

    return queryBuilder;
  }

  async findAppointmentsForCalendarByMonth(
    doctorId: string,
    startDate: string,
    endDate: string,
    take?: number
  ): Promise<AppointmentCalendarRawResult> {
    let queryBuilder: SelectQueryBuilder<Appointment>;

    if (take) {
      queryBuilder = this.repository.createQueryBuilder('appointment')
        .innerJoin(
          (qb) => {
            qb.select('a.id', 'id')
              .addSelect(`ROW_NUMBER() OVER (PARTITION BY (a.metadata->>'date') ORDER BY (a.metadata->>'from') ASC)`, 'rn')
              .addSelect(`COUNT(a.id) OVER (PARTITION BY (a.metadata->>'date'))`, 'day_total')
              .from(Appointment, 'a')
              .where('a.status = :status', { status: AppointmentStatus.SCHEDULED })
              .andWhere(`a.metadata->>'date' >= :startDate`, { startDate })
              .andWhere(`a.metadata->>'date' <= :endDate`, { endDate });
              
            if (doctorId) {
              qb.andWhere(`a.metadata->>'doctorId' = :doctorId`, { doctorId });
            }
            return qb;
          },
          'ranked',
          '"ranked"."id" = appointment.id'
        )
        .leftJoinAndSelect('appointment.patient', 'patient')
        .leftJoinAndSelect('patient.user', 'user')
        .addSelect('ranked.day_total', 'day_total')
        .orderBy(`appointment.metadata->>'date'`, 'ASC')
        .addOrderBy(`appointment.metadata->>'from'`, 'ASC');

      if (take) {
        queryBuilder.andWhere('ranked.rn <= :take', { take });
      }

      const { entities, raw } = await queryBuilder.getRawAndEntities<AppointmentRawResult>();

      return plainToInstance(AppointmentCalendarRawResult, {
        entities: entities.map(entity => this._mapper.toDomain(entity)),
        raw: raw
      });
    } else queryBuilder = this._queryAppointmentByDay(startDate, endDate, doctorId)

    queryBuilder.leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user');

    const entities = await queryBuilder.getMany();

    return plainToInstance(AppointmentCalendarRawResult, {
      entities: entities.map(entity => this._mapper.toDomain(entity)),
      raw: []
    });

  }

  async findAppointmentsForCalendarByYear(
    doctorId: string,
    year: number,
    month: number,
  ): Promise<GetAppointmentCalendarResponseDto> {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();

    const queryBuilder = this._queryAppointmentByDay(startDate, endDate, doctorId);

    const [, total] = await queryBuilder.getManyAndCount();

    return plainToInstance(GetAppointmentCalendarResponseDto, {
      total: total,
      date: `${year.toString()}-${month.toString().padStart(2, '0')}`,
    });
  }

  async findDoctorAppointments(
    doctorId: string,
    input: GetPersonalAppointmentsRequestDto
  ): Promise<PaginatedResult<AppointmentEntity>> {
    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .innerJoinAndSelect('appointment.workingTime', 'workingTime')
      .innerJoinAndSelect('workingTime.shift', 'shift')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')
      .where('workingTime.doctorId = :doctorId', { doctorId })
      .andWhere('workingTime.date >= :startDate', { startDate: input.startDate })
      .andWhere('workingTime.date <= :endDate', { endDate: input.endDate });

    if (input.from) {
      queryBuilder.andWhere('shift.from >= :from', { from: input.from });
    }

    if (input.to) {
      queryBuilder.andWhere('shift.to <= :to', { to: input.to });
    }

    if (input.keyword) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :keyword OR user.lastName ILIKE :keyword OR user.phoneNumber ILIKE :keyword)',
        { keyword: `%${input.keyword}%` }
      );
    }

    if (input.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: input.status });
    }

    const sortField = input.sort ?? 'date';
    const sortOrder = input.sortDirection ?? SortDirection.DESC;
    queryBuilder.orderBy(`workingTime.${sortField}`, sortOrder as 'ASC' | 'DESC');

    if (input.skip) {
      queryBuilder.skip(input.skip);
    }
    if (input.take) {
      queryBuilder.take(input.take);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();

    const appointments = entities.map((entity) => this._mapper.toDomain(entity));

    return plainToInstance(PaginatedResult<AppointmentEntity>, {
      data: appointments,
      total,
    });
  }

  async updatePastAppointmentToCancelled(
    currentDate: string,
    currentTime: string
  ): Promise<void> {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .update(Appointment)
      .set({ status: AppointmentStatus.CANCELLED })
      .where('status = :status', { status: AppointmentStatus.SCHEDULED })
      .andWhere(
        "(metadata->>'date' < :currentDate OR (metadata->>'date' = :currentDate AND metadata->>'to' < :currentTime))",
        { currentDate, currentTime }
    )
      
    await queryBuilder.execute();
  }
}
