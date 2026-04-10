import { Expose } from 'class-transformer';

export class DeleteDoctorAccountResponseDto {
  @Expose()
  success: boolean;
}
