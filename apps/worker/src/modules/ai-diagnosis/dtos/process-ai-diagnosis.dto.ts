import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ProcessAiDiagnosisInputDto {
  @IsUUID()
  @IsNotEmpty()
  consultationId: string;

  @IsUUID()
  @IsNotEmpty()
  diagnoseModelId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  imageBase64: string;
}

export class ProcessAiDiagnosisResponseDto {
  result: boolean;
}
