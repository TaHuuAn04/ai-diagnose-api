import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChatbotModelRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  version?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accessToken?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  knowledgeName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  knowledgeUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  modelConfig?: any;
}
