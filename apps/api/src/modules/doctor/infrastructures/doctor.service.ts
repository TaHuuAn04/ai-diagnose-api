import { Inject, Injectable } from '@nestjs/common';

import { IDoctorRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';


import { PageDto, PageMetaDto } from '@app/core/dtos';
import { ExceptionHandler } from '@app/core/exception';

import { IDoctorService } from '../doctor.interface';
import { GetListDoctorRequestDto, GetListDoctorResponseDto } from '../dtos';

@Injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository
  ) {}

  async getListDoctors(
    request: GetListDoctorRequestDto
  ): Promise<PageDto<GetListDoctorResponseDto>> {
    try {
      const { take, page, shiftId, department } = request;

      const relations = shiftId 
        ? ['user', 'workingTime', 'workingTime.shift']
        : ['user'];

      const result = await this.doctorRepository.findAll({
        pagination: {
          page,
          limit: take,
        },
        relations,
        where: {
          department: department,
        },
      });

      let filteredData = result.data;
      if (shiftId) {
        filteredData = result.data.filter(doctor => 
          doctor.workingTime?.some(wt => wt.shift?.id === shiftId)
        );
      }

      const total = shiftId ? filteredData.length : (result.meta?.total ?? 0);

      const pageMeta = new PageMetaDto({
        take,
        page,
        itemCount: total,
      });

      const doctorDtos = filteredData.map(doctor =>
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
          return plainToInstance(GetListDoctorResponseDto, doctorMapping);
        }
      );

      return new PageDto<GetListDoctorResponseDto>(doctorDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list doctors');
    }
  }
}
