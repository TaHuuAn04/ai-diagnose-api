import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IConsultationRepository } from 'apps/api/src/core/repository';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';

import { ConsultationEntity } from '@app/core/domain/entities';
import { SortDirection } from '@app/core/domain/enums';

import { GetConsultationHistoryDto } from '../../../../modules/consultation/dtos';
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
  ): Promise<{ consultations: ConsultationEntity[]; total: number }> {
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
      queryBuilder.andWhere('shift.date >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('shift.date <= :endDate', { endDate });
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

    const sortField = 'updatedAt';
    const sortOrder = sortDirection ?? SortDirection.DESC;
    queryBuilder.orderBy(`consultation.${sortField}`, sortOrder as 'ASC' | 'DESC');

    const [entities, total] = await queryBuilder.getManyAndCount();

    return { consultations: entities.map((entity) => this._mapper.toDomain(entity)), total };
  }
}
