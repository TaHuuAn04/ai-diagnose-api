import { Expose, Type } from 'class-transformer';

import { WorkingTimeStatus } from '@app/core/domain/enums';

export class ShiftInfo {
  @Expose()
  id: string;

  @Expose()
  from: string;

  @Expose()
  to: string;

  @Expose()
  status: WorkingTimeStatus;
}

export class AvailableShiftResponseDto {
  @Expose()
  doctorId: string;

  @Expose()
  date: string;

  @Expose()
  @Type(() => ShiftInfo)
  shift: ShiftInfo[];
}
