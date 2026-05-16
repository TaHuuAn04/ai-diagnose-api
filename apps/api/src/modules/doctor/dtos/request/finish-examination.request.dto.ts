import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MedicineDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  concentration: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  usage: string;
}

export class ClinicalInfoDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  symptom?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty({ required: false, type: [String], enum: ['surface', 'deep', 'other'] })
  @IsArray()
  @IsOptional()
  @IsIn(['surface', 'deep', 'other'], { each: true })
  skinType?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  skinTypeNote?: string;

  @ApiProperty({ required: false, enum: ['local', 'spread', 'whole'] })
  @IsIn(['local', 'spread', 'whole'])
  @IsOptional()
  severity?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  allergy?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  history?: string;

  @ApiProperty({ required: false, enum: ['MALE', 'FEMALE'] })
  @IsIn(['MALE', 'FEMALE'])
  @IsOptional()
  gender?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  age?: number;

  @ApiProperty({ required: false, enum: ['yes', 'no'] })
  @IsIn(['yes', 'no'])
  @IsOptional()
  genetic?: string;
}

export class FinishExaminationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  consultationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  finalDiagnosis: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  currentCondition?: string;

  @ApiProperty({ type: [MedicineDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MedicineDto)
  medicines?: MedicineDto[];

  @ApiProperty({ type: ClinicalInfoDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClinicalInfoDto)
  clinicalInfo?: ClinicalInfoDto;

  @ApiProperty({ type: [String], required: false, description: 'Array of base64 image strings (AI result images or doctor-uploaded images)' })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false, description: 'Doctor advice for the patient' })
  @IsString()
  @IsOptional()
  doctorAdvice?: string;
}
