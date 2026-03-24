import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class GetDoctorDashboardRequestDto {
  @ApiProperty({
    description: 'Current date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @IsDateString()
  currentDate: string;

 @ApiProperty({
    description: 'Start week date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @IsDateString()
  startWeekDate: string;

  @ApiProperty({
    description: 'last start week date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @IsDateString()
  lastStartWeekDate: string;

  @ApiProperty({
    description: 'last end week date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @IsDateString()
  lastEndWeekDate: string;

  @ApiProperty({
    description: 'start month date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @IsDateString()
  startMonthDate: string;

  @ApiProperty({
    description: 'last start month date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @IsDateString()
  lastStartMonthDate: string;

  @ApiProperty({
    description: 'last end month date',
    example: '2026-03-01',
    default: new Date().toISOString().split('T')[0],
  })
  @IsNotEmpty()
  @IsDateString()
  lastEndMonthDate: string;
}