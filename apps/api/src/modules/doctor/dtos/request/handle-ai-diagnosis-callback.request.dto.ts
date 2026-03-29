import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class HandleAiDiagnosisCallbackRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  consultationId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  diagnoseModelId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  disease: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  probability: number;

  @ApiProperty()
  @IsString()
  aiAdvice: string;
}
