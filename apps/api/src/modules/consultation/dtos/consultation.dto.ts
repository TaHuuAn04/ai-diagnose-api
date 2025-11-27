import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

import { AppointmentDetailDto } from '../../appointment/dtos';

export class ConsultationDto {
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
    @ApiProperty({ example: 'Dr. John Doe' })
    doctorName: string

    @Expose()
    @ApiProperty({ type: AppointmentDetailDto })
    appointment: AppointmentDetailDto
}

