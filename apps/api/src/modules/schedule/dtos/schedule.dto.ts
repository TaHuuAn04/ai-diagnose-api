import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

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

    @Expose()
    @ApiProperty({ example: "H6 - 201" })
    room: string

    @Expose()
    @ApiProperty({ example: "Nguyễn Cao Tuấn"})
    doctorName: string
}

@Exclude()
export class ListScheduleInfo{
    @Expose()
    @ApiProperty({ type: ScheduleDto, isArray: true })
    appointments: ScheduleDto[]

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