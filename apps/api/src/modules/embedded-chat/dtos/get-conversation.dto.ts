import { ApiProperty } from '@nestjs/swagger';

import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetEmbeddedChatConversationQueryDto {
  @ApiProperty({
    required: true,
    type: Number,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  take: number;

  @ApiProperty({
    required: true,
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;
}

export class GetEmbeddedChatConversationInputDto extends GetEmbeddedChatConversationQueryDto {
  token: string;
}

export class EmbeddedChatConversationItemDto {
  @ApiProperty({
    required: true,
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'normal',
  })
  @Expose()
  status: string;

  @ApiProperty({
    required: true,
    type: Number,
    example: 1672531200,
  })
  @Expose()
  created_at: number;
}
