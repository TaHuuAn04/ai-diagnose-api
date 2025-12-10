import { Inject, Injectable } from '@nestjs/common';

import { IShiftRepository } from '@api/core/repository';
import { REPOSITORY_INJECTION_TOKEN } from '@api/enums';
import { plainToInstance } from 'class-transformer';

import { PageDto, PageMetaDto, PageOptionsDto } from '@app/core/dtos';
import { ExceptionHandler } from '@app/core/exception';

import { GetListShiftResponseDto } from '../dtos/response/shift.response.dto';
import { IShiftService } from '../interfaces';

@Injectable()
export class ShiftService implements IShiftService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.SHIFT_REPOSITORY)
    private readonly shiftRepository: IShiftRepository
  ) {}

  async getListShifts(
    userId: string,
    pageOptionsDto: PageOptionsDto
  ) : Promise<PageDto<GetListShiftResponseDto>> {
    try {
      const { take, page } = pageOptionsDto;

      const shifts = await this.shiftRepository.find(
        {}, 
        pageOptionsDto
      );


      const pageMeta = new PageMetaDto({
        take,
        page,
        itemCount: shifts.length,
      });

      const shiftDtos = shifts.map(shift => 
        plainToInstance(GetListShiftResponseDto, shift)
      );

      return new PageDto<GetListShiftResponseDto>(shiftDtos, pageMeta);
    } catch (error) {
      ExceptionHandler.handleErrorException(error, 'Error getting list shifts');
    }
  }
}
