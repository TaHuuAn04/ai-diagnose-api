import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAiDiagnosisRequestDto {
  @ApiProperty({ description: 'ID of the consultation' })
  @IsUUID()
  @IsNotEmpty()
  consultationId: string;

  @ApiProperty({ description: 'Description of symptoms' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Image of the lesion' })
  file: any;
}
