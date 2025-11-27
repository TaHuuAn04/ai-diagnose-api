import { ApiProperty } from '@nestjs/swagger';

import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class RebookingAppointmentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    doctor_id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    shift_id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'acde070d-8c4c-4f0d-9d8a-162843c10333' })
    appointment_id: string;

}