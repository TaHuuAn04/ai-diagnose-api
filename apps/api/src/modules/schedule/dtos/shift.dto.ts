import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { statusShift } from '@app/core/domain/enums';

import { UserInfoDto } from '../../user/dtos';

export class ShiftDto {
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
    @ApiProperty({ example: "Nguyễn Cao Tuấn"})
    doctorName: string

    @Expose()
    @ApiProperty({ example: 'AVAILABLE'})
    status: statusShift

    @Expose()
    @ApiProperty({ type: UserInfoDto})
    patientInfo?: UserInfoDto
}

export class ShiftListInfo{
    @Expose()
    @ApiProperty({ type: ShiftDto, isArray: true })
    shifts: ShiftDto[]

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

export class ShiftBookingListInfo extends ShiftListInfo {
    @Expose()
    @ApiProperty({ type: Date, example: '27/12/2025' })
    date: Date
}