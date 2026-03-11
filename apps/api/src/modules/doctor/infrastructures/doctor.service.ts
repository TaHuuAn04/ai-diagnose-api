import { Inject, Injectable } from '@nestjs/common';

import { IDoctorRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { PageDto, PageMetaDto } from '@app/core/dtos';
import { ExceptionHandler, NotFoundException } from '@app/core/exception';

import { IDoctorService } from '../doctor.interface';
import { GetDoctorResponseDto, GetListDoctorRequestDto } from '../dtos';

@Injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository
  ) {}

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

      const doctorDtos = result.map(doctor =>
        {
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
}
