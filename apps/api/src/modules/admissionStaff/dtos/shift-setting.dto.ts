import { ApiProperty } from '@nestjs/swagger';

import {
    IsDate,
    IsNotEmpty,
    IsNumber,
} from 'class-validator';

export class ShiftSettingDto {
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({ type: String, format: 'date', example: '2025-11-14', description: 'Date (YYYY-MM-DD)' })
    startDate: Date
    
    @IsDate()
    @IsNotEmpty()
    @ApiProperty({ type: String, format: 'date', example: '2025-11-14', description: 'Date (YYYY-MM-DD)' })
    endDate: Date

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ type: Number, example: '15', description: 'Shift time (minutes)' })
    durationTime: number
}