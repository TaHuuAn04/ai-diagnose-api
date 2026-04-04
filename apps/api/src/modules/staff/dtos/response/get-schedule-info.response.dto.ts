import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetScheduleResponseDto {
  @Expose()
  scheduleId: string;

  @Expose()
  doctorId: string;

  @Expose()
  @ApiProperty({ example: '2026-03-01' })
  date: string;

  @Expose()
  @ApiProperty({ example: '09:00' })
  from: string;

  @Expose()
  @ApiProperty({ example: '10:00' })
  to: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  doctorName: string;

  @Expose()
  @ApiProperty({ example: 'Room 101' })
  room: string;
}
