import { Expose } from 'class-transformer';

export class CreateAdmissionStaffAccountResponseDto {
  @Expose()
  userId: string;
}
