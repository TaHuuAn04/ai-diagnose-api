import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AiProviderType } from '@app/core/domain/enums';

export class ModelConfigDto {
  @ApiProperty({ enum: AiProviderType })
  @IsEnum(AiProviderType)
  @IsNotEmpty()
  providerType: AiProviderType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nameModel: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accessToken?: string;
}
