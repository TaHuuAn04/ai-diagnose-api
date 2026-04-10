import { Expose } from 'class-transformer';

export class UpdateAdmissionStaffAccountResponseDto {
  @Expose()
  success: boolean;
}
