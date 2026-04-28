import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

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
  usage: string;
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
}
