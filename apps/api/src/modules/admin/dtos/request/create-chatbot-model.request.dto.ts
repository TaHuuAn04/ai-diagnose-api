import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatbotModelRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  knowledgeName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  knowledgeUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  modelConfig?: any;
}
