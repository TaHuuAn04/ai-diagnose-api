import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { SortDirection } from '../domain/enums';

export class PageOptionsDto {
  @ApiPropertyOptional({
    type: String,
    required: false,
    nullable: true,
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sort?: string | null;

  @ApiPropertyOptional({
    enum: SortDirection,
    required: false,
    nullable: true,
    example: SortDirection.ASC,
  })
  @IsEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection | null;

  @ApiProperty({
    type: Number,
    required: true,
    minimum: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({
    type: Number,
    required: true,
    minimum: 1,
    maximum: 50,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  take: number;

  @ApiPropertyOptional({
    type: String,
    required: false,
    nullable: true,
    example: 'keyword',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  get skip(): number {
    return this.page === 1 ? 0 : (this.page - 1) * this.take;
  }
}
