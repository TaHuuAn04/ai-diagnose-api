import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';

export class UpdatePatientOnboardingRequestDto {
  @ApiProperty()
  @IsBoolean()
  isOnBoardingCompleted: boolean;
}
