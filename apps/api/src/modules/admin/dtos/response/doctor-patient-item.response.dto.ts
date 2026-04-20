import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DoctorPatientItemResponseDto {
  @ApiProperty()
  @Expose()
  patientId: string;

  @ApiProperty()
  @Expose()
  patientName: string;

  @ApiProperty()
  @Expose()
  citizenCode: string;

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  totalExaminations: number;
}
