import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';


export class ScheduleDto {
    @Expose()
    @ApiProperty({ type: String, format: 'date', example: '2025-11-14', description: 'Date (YYYY-MM-DD)' })
    date: Date

    @Expose()
    @ApiProperty({ type: String, example: '08:30:00', description: 'Start time (HH:mm:ss)' })
    from: string

    @Expose()
    @ApiProperty({ type: String, example: '09:00:00', description: 'End time (HH:mm:ss)' })
    to: string
}
