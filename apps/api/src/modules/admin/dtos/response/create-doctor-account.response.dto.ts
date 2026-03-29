import { Expose } from 'class-transformer';

export class CreateDoctorAccountResponseDto {
  @Expose()
  userId: string;
}
