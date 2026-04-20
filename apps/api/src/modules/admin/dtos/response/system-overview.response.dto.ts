import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class SystemOverviewResponseDto {
  @ApiProperty({ description: 'Total number of examinations using AI' })
  @Expose()
  totalAiUsage: number;

  @ApiProperty({ description: 'Growth percentage of AI usage compared to previous month' })
  @Expose()
  aiUsageGrowth: number;

  @ApiProperty({ description: 'Total number of examinations (Consultations completed)' })
  @Expose()
  totalExaminations: number;

  @ApiProperty({ description: 'Growth percentage of examinations' })
  @Expose()
  examinationGrowth: number;

  @ApiProperty({ description: 'Number of new patients registered in the month' })
  @Expose()
  newPatients: number;

  @ApiProperty({ description: 'Growth percentage of new patients' })
  @Expose()
  patientGrowth: number;

  @ApiProperty({ description: 'Number of chatbot sessions used by patients' })
  @Expose()
  chatbotUsage: number;

  @ApiProperty({ description: 'Growth percentage of chatbot usage' })
  @Expose()
  chatbotUsageGrowth: number;
}
