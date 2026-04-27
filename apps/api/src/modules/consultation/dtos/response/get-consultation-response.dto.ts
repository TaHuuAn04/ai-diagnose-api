import { ApiProperty } from "@nestjs/swagger";

import { Exclude, Expose } from "class-transformer";

import { ImageInfoDto } from "@app/core/dtos";
export class PrescriptionItemDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  concentration: string;

  @Expose()
  @ApiProperty()
  quantity: string;

  @Expose()
  @ApiProperty()
  dosage: string;

  @Expose()
  @ApiProperty()
  duration: number;
}

@Exclude()
export class GetConsultationResponseDto {
  @Expose()
  @ApiProperty({ example: 'e9c8a957-5111-427a-af72-78e8bfc8f3dd' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Dr. John Doe' })
  doctorName: string;

  @Expose()
  @ApiProperty({ example: 'Cardiology' })
  department: string;

  @Expose()
  @ApiProperty({ example: '2024-07-15' })
  date: string;

  @Expose()
  @ApiProperty({ example: '09:00' })
  from: string;	

  @Expose()
  @ApiProperty({ example: '10:00' })
  to: string;

  @Expose()
  @ApiProperty({ example: 'Room 101' })
  room: string;

  @Expose()
  @ApiProperty({ example: '["Hypertension"]' })
  diseases?: string[] | [];

  @Expose()
  @ApiProperty({ example: 'Patient has been experiencing high blood pressure for the past 3 months. Prescribed medication and advised lifestyle changes.' })
  advices: string;

  @Expose()
  @ApiProperty({ type: [PrescriptionItemDto] })
  prescription?: PrescriptionItemDto[] | [];

  @Expose()
  @ApiProperty({ example: 'Headache, dizziness' })
  symptoms: string;

  @Expose()
  @ApiProperty({ example: [{ base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', order: 1 }] })
  images?: ImageInfoDto[] | [];
}
