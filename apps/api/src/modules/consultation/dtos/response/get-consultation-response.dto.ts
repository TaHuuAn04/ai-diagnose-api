import { ApiProperty } from "@nestjs/swagger";

import { Exclude, Expose } from "class-transformer";

import { ClinicalInfo } from "@app/core/domain/entities/diagnosis-result";
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
  duration: string;
}

@Exclude()
export class ClinicalInfoDto {
  @Expose()
  @ApiProperty({ example: 'Fever, cough, sore throat', required: false })
  symptom?: string;

  @Expose()
  @ApiProperty({ example: 'Chest, throat', required: false })
  location?: string;

  @Expose()
  @ApiProperty({ example: '3 days', required: false })
  duration?: string;

  @Expose()
  @ApiProperty({ example: ['rash', 'blisters'], required: false })
  skinType?: string[];

  @Expose()
  @ApiProperty({ example: 'localized', required: false })
  severity?: 'local' | 'spread' | 'systemic';

  @Expose()
  @ApiProperty({ example: 'Penicillin allergy', required: false })
  allergy?: string;

  @Expose()
  @ApiProperty({ example: 'No history of asthma', required: false })
  history?: string;

  @Expose()
  @ApiProperty({ example: 'MALE', required: false })
  gender?: string;

  @Expose()
  @ApiProperty({ example: 30, required: false })
  age?: number;

  @Expose()
  @ApiProperty({ example: 'no', required: false })
  genetic?: string;
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
  @ApiProperty({ example: 'Patient condition description', required: false })
  description?: string;

  @Expose()
  @ApiProperty({ example: [{ base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', order: 1 }] })
  images?: ImageInfoDto[] | [];

  @Expose()
  @ApiProperty({ required: false })
  clinicalInfo?: ClinicalInfoDto | null;
}
