import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';

export class TopDoctorStatisticsItemResponseDto {
  @ApiProperty()
  @Expose()
  doctorId: string;

  @ApiProperty()
  @Expose()
  doctorName: string;

  @ApiProperty()
  @Expose()
  department: string;

  @ApiProperty()
  @Expose()
  totalExaminations: number;

  @ApiProperty()
  @Expose()
  uniquePatients: number;

  @ApiProperty({ description: 'Percent of examined cases where AI result exists' })
  @Expose()
  aiUsageRate: number;
}

export class DepartmentDistributionItemResponseDto {
  @ApiProperty()
  @Expose()
  department: string;

  @ApiProperty()
  @Expose()
  totalExaminations: number;

  @ApiProperty()
  @Expose()
  percentage: number;
}

export class DoctorPerformanceStatisticsResponseDto {
  @ApiProperty()
  @Expose()
  month: number;

  @ApiProperty()
  @Expose()
  year: number;

  @ApiProperty()
  @Expose()
  totalExaminations: number;

  @ApiProperty({ type: [TopDoctorStatisticsItemResponseDto] })
  @Expose()
  @Type(() => TopDoctorStatisticsItemResponseDto)
  topDoctors: TopDoctorStatisticsItemResponseDto[];

  @ApiProperty({ type: [DepartmentDistributionItemResponseDto] })
  @Expose()
  @Type(() => DepartmentDistributionItemResponseDto)
  departmentDistribution: DepartmentDistributionItemResponseDto[];
}
