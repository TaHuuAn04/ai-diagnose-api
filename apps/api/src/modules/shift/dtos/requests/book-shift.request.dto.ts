import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class BookShiftRequestDto {
  @ApiProperty({ 
    description: 'Doctor ID',
    example: '11111111-1111-1111-1111-111111111111'
  })
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ 
    description: 'Shift ID to book',
    example: 'e9c8a957-5111-427a-af72-78e8bfc8f3dd'
  })
  @IsUUID()
  @IsNotEmpty()
  shiftId: string;

  @ApiProperty({ 
    description: 'Patient ID',
    example: '33333333-3333-3333-3333-333333333333'
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ 
    description: 'Appointment description (optional)',
    example: 'Regular checkup',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}
