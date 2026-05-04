import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IConsultationRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ConsultationEntity } from '@app/core/domain/entities';
import { SortDirection } from '@app/core/domain/enums';
import { PaginatedResult } from '@app/core/dtos';
import { getEndMonth, getStartMonth } from '@app/utils';

import { GetConsultationHistoryDto, GetMonthlyDiseasesRequestDto } from '../../../../modules/consultation/dtos';
import { GetDoctorConsultationHistoryRequestDto } from '../../../../modules/doctor/dtos';
import { Consultation } from '../entities';

import { GenericRepository } from './generic-repository';

@Injectable()
export class ConsultationRepository
  extends GenericRepository<ConsultationEntity, Consultation>
  implements IConsultationRepository
{
  constructor(
    @InjectRepository(Consultation)
    public readonly repository: Repository<Consultation>,
  ) {
    super(repository, {
      toDomain: (typeOrmEntity: Consultation): ConsultationEntity => {
        return plainToInstance(ConsultationEntity, typeOrmEntity);
      },
      toOrmEntity: (domainEntity: ConsultationEntity): Consultation => {
        return plainToInstance(Consultation, domainEntity);
      }
    });
  }

  async findConsultationHistory(
    patientId: string,
    request: GetConsultationHistoryDto
  ): Promise<PaginatedResult<ConsultationEntity>> {
    const { department, startDate, endDate, sortDirection, keyword, skip, take } = request;
    
    const queryBuilder = this.repository
      .createQueryBuilder('consultation')
      .where('consultation.patientId = :patientId', { patientId })
      .leftJoinAndSelect('consultation.appointment', 'appointment')
      .leftJoinAndSelect('appointment.workingTime', 'workingTime')
      .leftJoinAndSelect('workingTime.shift', 'shift')
      .leftJoinAndSelect('consultation.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'user')
    
    if (department) {
      queryBuilder.andWhere('doctor.department = :department', { department });
    }

    if (startDate) {
      queryBuilder.andWhere('workingTime.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('workingTime.date <= :endDate', { endDate });
    }

    if (keyword) {
      queryBuilder.andWhere(
        `CONCAT(user.firstName, ' ', user.lastName) ILIKE :keyword`,
        { keyword: `%${keyword}%` },
      );
    }

    if (skip) {
      queryBuilder.skip(skip);
    }
    if (take) {
      queryBuilder.take(take);
    }

    queryBuilder.leftJoinAndSelect('consultation.diagnosisResult', 'diagnosisResult')
                .leftJoinAndSelect('diagnosisResult.diseases', 'resultDisease');

    const sortOrder = sortDirection ?? SortDirection.DESC;
    queryBuilder.orderBy('workingTime.date', sortOrder as 'ASC' | 'DESC')
      .addOrderBy('shift.from', sortOrder as 'ASC' | 'DESC');

    const [entities, total] = await queryBuilder.getManyAndCount();

    return plainToInstance(PaginatedResult<ConsultationEntity>, {
      data: entities.map(entity => this._mapper.toDomain(entity)),
      total,
    });
  }

  async findDoctorConsultationHistory(
    doctorId: string,
    request: GetDoctorConsultationHistoryRequestDto
  ): Promise<PaginatedResult<ConsultationEntity>> {
    const { skip, take, keyword, startDate, endDate, sortBy, sortDirection } = request;
    const sortOrder = sortDirection ?? 'DESC';
    const sortField = sortBy ?? 'createdAt';

    const queryBuilder = this.repository
      .createQueryBuilder('consultation')
      .where('consultation.doctorId = :doctorId', { doctorId })
      .leftJoinAndSelect('consultation.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')
      .leftJoinAndSelect('consultation.aiResult', 'aiResult')
      .leftJoinAndSelect('consultation.diagnosisResult', 'diagnosisResult')
      .leftJoinAndSelect('diagnosisResult.diseases', 'resultDisease')
      .leftJoinAndSelect('resultDisease.disease', 'diseaseData');

    if (startDate) {
      queryBuilder.andWhere('consultation.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('consultation.createdAt <= :endDate', { endDate });
    }

    if (keyword) {
      queryBuilder.andWhere(
        `CONCAT(user.firstName, ' ', user.lastName) ILIKE :keyword`,
        { keyword: `%${keyword}%` },
      );
    }

    if (skip !== undefined) queryBuilder.skip(skip);
    if (take !== undefined) queryBuilder.take(take);

    queryBuilder.orderBy(`consultation.${sortField}`, sortOrder);

    const [entities, total] = await queryBuilder.getManyAndCount();

    return plainToInstance(PaginatedResult<ConsultationEntity>, {
      data: entities.map(entity => this._mapper.toDomain(entity)),
      total,
    });
  }

  async findConsultationDetailById(consultationId: string, doctorId: string): Promise<ConsultationEntity | null> {
    const queryBuilder = this.repository
      .createQueryBuilder('consultation')
      .where('consultation.id = :consultationId', { consultationId })
      .andWhere('consultation.doctorId = :doctorId', { doctorId })
      .leftJoinAndSelect('consultation.appointment', 'appointment')
      .leftJoinAndSelect('consultation.patient', 'patient')
      .leftJoinAndSelect('patient.user', 'user')
      .leftJoinAndSelect('consultation.aiResult', 'aiResult')
      .leftJoinAndSelect('aiResult.diseases', 'aiDiseases')
      .leftJoinAndSelect('aiDiseases.disease', 'aiDiseaseData')
      .leftJoinAndSelect('consultation.diagnosisResult', 'diagnosisResult')
      .leftJoinAndSelect('diagnosisResult.diseases', 'resultDisease')
      .leftJoinAndSelect('resultDisease.disease', 'diseaseData');

    const entity = await queryBuilder.getOne();
    if (!entity) return null;
    return this._mapper.toDomain(entity);
  }

  async findAllByPatientId(patientId: string, excludeConsultationId?: string): Promise<ConsultationEntity[]> {
     const queryBuilder = this.repository
       .createQueryBuilder('consultation')
       .where('consultation.patientId = :patientId', { patientId })
       .leftJoinAndSelect('consultation.doctor', 'doctor')
       .leftJoinAndSelect('doctor.user', 'doctorUser')
       .leftJoinAndSelect('consultation.aiResult', 'aiResult')
       .leftJoinAndSelect('aiResult.diseases', 'aiDiseases')
       .leftJoinAndSelect('aiDiseases.disease', 'aiDiseaseData')
       .leftJoinAndSelect('consultation.diagnosisResult', 'diagnosisResult')
       .leftJoinAndSelect('diagnosisResult.diseases', 'resultDisease')
       .leftJoinAndSelect('resultDisease.disease', 'diseaseData')
       .orderBy('consultation.createdAt', 'DESC');
       
     if (excludeConsultationId) {
       queryBuilder.andWhere('consultation.id != :excludeConsultationId', { excludeConsultationId });
     }
     
     const entities = await queryBuilder.getMany();
     return entities.map(e => this._mapper.toDomain(e));
  }

  async findLatestConsultationsByPatientIds(
    patientIds: string[]
  ): Promise<ConsultationEntity[]> {
    if (!patientIds || patientIds.length === 0) return [];

    const queryBuilder = this.repository
      .createQueryBuilder('consultation')
      .innerJoin(
        (qb) => qb
          .select('c.patientId', 'patientId')
          .addSelect('MAX(c.createdAt)', 'maxCreatedAt')
          .from(Consultation, 'c')
          .groupBy('c.patientId')
          .where('c.patientId IN (:...patientIds)', { patientIds }),
        'max_c',
        'consultation.patientId = "max_c"."patientId" AND consultation.createdAt = "max_c"."maxCreatedAt"'
      )
      .leftJoinAndSelect('consultation.diagnosisResult', 'diagnosisResult')
      .leftJoinAndSelect('diagnosisResult.diseases', 'diseases');

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this._mapper.toDomain(entity));
  }

  async findConsultationWithDepartmentRelated(
    department: string,
    request: GetMonthlyDiseasesRequestDto
  ): Promise<ConsultationEntity[]> {
    const { startMonthDate, endMonthDate } = request;
    
    const startDate = getStartMonth(startMonthDate);
    const endDate = getEndMonth(endMonthDate);

    const queryBuilder = this.repository
      .createQueryBuilder('consultation')
      .where('consultation.createdAt >= :startDate', { startDate })
      .andWhere('consultation.createdAt <= :endDate', { endDate })
      .andWhere('consultation.appointmentId IS NOT NULL')
      .leftJoinAndSelect('consultation.doctor', 'doctor')
      .andWhere('doctor.department = :department', { department })
      .leftJoinAndSelect('consultation.diagnosisResult', 'diagnosisResult')
      .leftJoinAndSelect('diagnosisResult.diseases', 'diseases');

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this._mapper.toDomain(entity));
  }
}
