import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

import { ActiveStatus } from '@app/core/domain/enums';

@Exclude()
export class GetActiveDoctorsResponseDto {
  @Expose()
  @ApiProperty({ example: 'John Doe' })
  doctorName: string;

  @Expose()
  @ApiProperty({ example: 'Cardiology' })
  department: string;
  
  @Expose()
  @ApiProperty({ example: ActiveStatus.ON_DUTY, enum: ActiveStatus })
  status: ActiveStatus;
}
