import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose, Type } from 'class-transformer';

export class NearestEmptyShiftInfo {
  @Expose()
  shiftId: string;

  @Expose()
  startTime: string;

  @Expose()
  doctorName: string[];
}


@Exclude()
export class StaffDashboardStatisticsDto {
  @Expose()
  @ApiProperty({ description: 'Today appointments count' })
  todayAppointmentsCount: number

  @Expose()
  @ApiProperty({ description: 'This month appointments count' })
  thisMonthAppointmentsCount: number

  @Expose()
  @ApiProperty({ description: 'Last month appointments count' })
  lastMonthAppointmentsCount: number

  @ApiProperty({ type: [NearestEmptyShiftInfo] })
  @Expose()
  @Type(() => NearestEmptyShiftInfo)
  shifts?: NearestEmptyShiftInfo[];
}
