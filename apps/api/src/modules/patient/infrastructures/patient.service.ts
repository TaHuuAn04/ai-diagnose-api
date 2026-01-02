import { Inject, Injectable } from '@nestjs/common';

import { IPatientRepository, IUserRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { PageDto, PageMetaDto, PageOptionsDto } from '@app/core/dtos';
import { ExceptionHandler, NotFoundException } from '@app/core/exception';

import { CreatePatientResponseDto, PatientInfoDto, UpdatePatientDto } from '../dtos';
import { IPatientService } from '../interfaces';

@Injectable()
export class PatientService implements IPatientService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
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

  // async getMedicalRecords(
  //   userId: string,
  //   pageOptionsDto: PageOptionsDto
  // ): Promise<PageDto<MedicalRecordsDto>> {
  //   try {
  //     const { take, page } = pageOptionsDto;
      
  //     // Find all medical records for the patient
      

  //     const pageMeta = new PageMetaDto({
  //       take,
  //       page,
  //       itemCount: result.meta?.total ?? 0,
  //     });

  //     const shiftDtos = result.data.map(shift => 
  //       plainToInstance(GetListShiftResponseDto, shift)
  //     );

  //     return new PageDto<GetListShiftResponseDto>(shiftDtos, pageMeta);
  //   } catch (error) {
  //     ExceptionHandler.handleErrorException(error, 'Error getting medical records');
  //   }
  // }

  @Transactional()
  async createPatient(userId: string): Promise<CreatePatientResponseDto> {
    try {
      const createdPatient = await this.patientRepository.create({
        userId,
      });

      const responseDto = plainToInstance(CreatePatientResponseDto, createdPatient);
      return responseDto;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error creating patient');
    }
  }

  @Transactional()
  async updatePatient(
    userId: string,
    input: UpdatePatientDto):
  Promise<PatientInfoDto> {
    try {
      const existingPatient = await this.patientRepository.findOne({
        where: { userId },
        relations: ['user'],
      });
      
      if (!existingPatient) {
        throw new NotFoundException(`Patient not found with userId ${userId}`);
      }
      if (!existingPatient.user) {
        throw new NotFoundException(`User not found for patient with id ${userId}`);
      }

      const updatedPatient = await this.patientRepository.update(
        userId,
        {
          userId: userId,
          folk: input.folk,
          address: input.address,
          citizenCode: input.citizenCode,
          medicalInsurance: input.medicalInsurance
        }
      );
      // Also update user-related fields if necessary
      const updatedUser = await this.userRepository.update(
        userId,
        {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneCode: input.phoneCode,
          phoneNumber: input.phoneNumber,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
          avatarUrl: input.avatarUrl,
          isOnBoardingCompleted: input.isOnBoardingCompleted,
        }
      );

      const responseDto = plainToInstance(PatientInfoDto, {
        ...updatedPatient,
        ...updatedUser,
      }); 
      return responseDto;
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error updating patient');
    }
  }     
}
