import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class GetMonthlyDiseasesRequestDto {
  @ApiPropertyOptional({
    description: 'Filter by start month date',
    required: true,
    example: '2024-01-01',
  })
  @IsNotEmpty()
  startMonthDate: string;

  @ApiPropertyOptional({
    description: 'Filter by end month date',
    required: true,
    example: '2024-01-01',
  })
  @IsNotEmpty()
  endMonthDate: string;
}