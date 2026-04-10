import { Expose } from 'class-transformer';

export class UpdateDoctorAccountResponseDto {
  @Expose()
  success: boolean;
}
