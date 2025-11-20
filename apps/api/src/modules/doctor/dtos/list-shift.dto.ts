import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { ShiftDto } from '../../schedule/dtos';

export class ShiftListInfo{
    @Expose()
    @ApiProperty({ type: ShiftDto, isArray: true })
    appointments: ShiftDto[]

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

