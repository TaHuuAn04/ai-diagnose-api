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

  @ApiProperty({ type: [NearestEmptyShiftInfo] })
  @Expose()
  @Type(() => NearestEmptyShiftInfo)
  shifts?: NearestEmptyShiftInfo[];
}
