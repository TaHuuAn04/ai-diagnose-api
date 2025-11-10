import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UpdateOrDeleteResponseDto {
  @Expose()
  @ApiProperty({ example: true, type: Boolean })
  isSuccess: boolean;

  @Expose()
  @ApiPropertyOptional({
    example: 'Update or delete successfully',
    type: String,
    nullable: true,
  })
  message?: string;

  @Expose()
  @ApiPropertyOptional({
    example: '2024-01-01 00:00:00',
    type: Date,
    nullable: true,
  })
  at?: Date = new Date();
}
