import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { ConsultationDto } from './consultation.dto';

export class MedicalRecordInfoDto {
    @Expose()
    @Type(() => Date)
    @ApiProperty({
        type: String,
        format: 'date-time',
        example: '2025-11-13T14:30:00.000Z',
        description: 'Consultation session time'
    })
    datetime: Date

    @Expose()
    @ApiProperty({ example: 'Open wound 4cm long due to daily life accident' })
    symstomsText: string

    @Expose()
    @ApiProperty({ example: 'Avoid chicken and eggs' })
    advices: string

    @Expose()
    @ApiProperty({ example: 'Zinnat 500mg' })
    prescription: string

    @Expose()
    @ApiProperty({ example: 'Torn skin on right forearm' })
    conclude: string

    @Expose()
    @ApiProperty({ type: ConsultationDto })
    appointment: ConsultationDto
}

export class MedicalRecords{
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


