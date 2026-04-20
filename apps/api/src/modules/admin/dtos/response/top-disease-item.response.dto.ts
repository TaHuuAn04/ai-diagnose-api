import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TopDiseaseItemResponseDto {
  @ApiProperty()
  @Expose()
  diseaseName: string;

  @ApiProperty()
  @Expose()
  count: number;
}
