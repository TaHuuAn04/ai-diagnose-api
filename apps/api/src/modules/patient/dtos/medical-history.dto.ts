import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { ConsultationDto } from '../../consultation/dtos';

export class MedicalRecordsInfo{
    @Expose()
    @ApiProperty({ type: ConsultationDto, isArray: true })
    consultations: ConsultationDto[]

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

