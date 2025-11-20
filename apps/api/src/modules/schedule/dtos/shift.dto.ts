import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { statusShift } from '@app/core/domain/enums';

import { ScheduleDto } from '../../schedule/dtos';

export class ShiftDto {
    @Expose()
    @ApiProperty({ type: ScheduleDto })
    schedule: ScheduleDto

    @Expose()
    @ApiProperty({ example: 'AVAILABLE'})
    status: statusShift
}
