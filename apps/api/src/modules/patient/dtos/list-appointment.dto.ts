import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { AppointmentDetailDto } from '../../appointment/dtos';

export class AppointmentListInfo{
    @Expose()
    @ApiProperty({ type: AppointmentDetailDto, isArray: true })
    appointments: AppointmentDetailDto[]

    @Expose()
    @ApiProperty({ example: 100 })
    totalRecords: number

    @Expose()
    @ApiProperty({ example: 1 })
    currentPage: number

    @Expose()
    @ApiProperty({ example: 10 })
    pageSize: number

    @Expose()
    @ApiProperty({ example: 10 })
    totalPages: number
}

