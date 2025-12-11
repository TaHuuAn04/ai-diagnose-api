import { Inject, Injectable } from '@nestjs/common';

import { IDoctorRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { PageDto, PageMetaDto, PageOptionsDto } from '@app/core/dtos';
import { ExceptionHandler } from '@app/core/exception';

import { IDoctorService } from '../doctor.interface';
import { GetListDoctorResponseDto } from '../dtos/response';

@Injectable()
export class DoctorService implements IDoctorService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.DOCTOR_REPOSITORY)
    private readonly doctorRepository: IDoctorRepository
  ) {}

  async getListDoctors(
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<GetListDoctorResponseDto>> {
    try {
      const { take, page } = pageOptionsDto;

      // Use findAll with QueryOptions for better querying
      const result = await this.doctorRepository.findAll({
        pagination: {
          page,
          limit: take,
        },
        relations: ['user'],
      });

      const pageMeta = new PageMetaDto({
        take,
        page,
        itemCount: result.meta?.total ?? 0,
      });

      const doctorDtos = result.data.map(doctor =>
        plainToInstance(GetListDoctorResponseDto, doctor, {
          excludeExtraneousValues: true,
        })
      );

      return new PageDto<GetListDoctorResponseDto>(doctorDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list doctors');
    }
  }
}
