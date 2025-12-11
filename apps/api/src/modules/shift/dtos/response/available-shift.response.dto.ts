import { Expose, Type } from 'class-transformer';

import { WorkingTimeStatus } from '@app/core/domain/enums';

class ShiftInfo {
  @Expose()
  id: string;

  @Expose()
  date: string;

  @Expose()
  from: string;

  @Expose()
  to: string;
}

export class AvailableShiftResponseDto {
  @Expose()
  doctorId: string;

  @Expose()
  shiftId: string;

  @Expose()
  status: WorkingTimeStatus;

  @Expose()
  @Type(() => ShiftInfo)
  shift: ShiftInfo;
}
