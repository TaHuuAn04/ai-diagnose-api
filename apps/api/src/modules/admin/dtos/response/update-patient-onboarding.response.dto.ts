import { Expose } from 'class-transformer';

export class UpdatePatientOnboardingResponseDto {
  @Expose()
  success: boolean;
}
