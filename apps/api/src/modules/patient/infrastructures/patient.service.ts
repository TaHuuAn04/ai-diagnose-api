import { Inject, Injectable } from '@nestjs/common';

import { IPatientRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';
// import { PageDto, PageMetaDto, PageOptionsDto } from '@app/core/dtos';
import { Transactional } from 'typeorm-transactional';

import { ExceptionHandler, NotFoundException } from '@app/core/exception';

import { CreatePatientDto, CreatePatientResponseDto, PatientInfoDto } from '../dtos';
import { IPatientService } from '../interfaces';

@Injectable()
export class PatientService implements IPatientService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository
  ) {}

  async getInfo(
    userId: string,
  ) : Promise<PatientInfoDto> {
    try {
      const info = await this.patientRepository.findOne(
        {
          where: { userId },
          relations: ['user']
        },
      );

      if (!info) {
        throw new NotFoundException(`Patient not found with userId ${userId}`);
      }
      if (!info.user) {
        throw new NotFoundException(`User not found for patient with id ${userId}`);
      }

      const patientDto = {
        ...info,
        id: info.user.id,
        firstName: info.user.firstName,
        lastName: info.user.lastName,
        email: info.user.email,
        phoneNumber: info.user.phoneNumber,
        role: info.user.role,
        gender: info.user.gender,
        dateOfBirth: info.user.dateOfBirth,
        phoneCode: info.user.phoneCode,
        avatarUrl: info.user.avatarUrl,
        isOnBoardingCompleted: info.user.isOnBoardingCompleted,
      };

      return plainToInstance(PatientInfoDto, patientDto);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting patient information');
    }
  }

  @Transactional()
  async createPatient(input: CreatePatientDto): Promise<CreatePatientResponseDto> {
    try {
      const createdPatient = await this.patientRepository.create({
        ...input,
      });

      const responseDto = plainToInstance(CreatePatientResponseDto, createdPatient);
      return responseDto;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error creating patient');
    }
  }
}
