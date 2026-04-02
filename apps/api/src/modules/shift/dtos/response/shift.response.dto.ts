import { Exclude, Expose } from "class-transformer";
import { IsEnum } from "class-validator";

import { ShiftStatus } from "@app/core/domain/enums";

@Exclude()
export class GetListShiftResponseDto {
  @Expose()
  id: string;

  @Expose()
  from: string;

  @Expose()
  to: string;

  @Expose()
  @IsEnum(() => ShiftStatus)
  status: ShiftStatus;
}