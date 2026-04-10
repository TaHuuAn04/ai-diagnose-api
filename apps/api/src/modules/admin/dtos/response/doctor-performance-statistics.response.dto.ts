import { ApiProperty } from '@nestjs/swagger';

export class TopDoctorStatisticsItemResponseDto {
  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  doctorName: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  totalExaminations: number;

  @ApiProperty()
  uniquePatients: number;

  @ApiProperty({ description: 'Percent of examined cases where AI result exists' })
  aiUsageRate: number;
}

export class DepartmentDistributionItemResponseDto {
  @ApiProperty()
  department: string;

  @ApiProperty()
  totalExaminations: number;

  @ApiProperty()
  percentage: number;
}

export class DoctorPerformanceStatisticsResponseDto {
  @ApiProperty()
  month: number;

  @ApiProperty()
  year: number;

  @ApiProperty()
  totalExaminations: number;

  @ApiProperty({ type: [TopDoctorStatisticsItemResponseDto] })
  topDoctors: TopDoctorStatisticsItemResponseDto[];

  @ApiProperty({ type: [DepartmentDistributionItemResponseDto] })
  departmentDistribution: DepartmentDistributionItemResponseDto[];
}
