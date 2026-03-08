import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class EmbeddedChatMessageItemDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The id of the message',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The message',
    example: 'Hello, how are you?',
  })
  @Expose()
  message: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The type of the message',
    example: 'received',
  })
  @Expose()
  type: 'received' | 'sent';

  @ApiPropertyOptional({
    type: [String],
    description: 'Image URLs attached to this message',
  })
  @Expose()
  imageUrls?: string[];
}

export class GetEmbeddedChatMessagesByConversationIdQueryDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The id of the conversation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of messages to return (1-100)',
    example: 20,
    default: 20,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => (value ? Number(value) : 20))
  limit?: number = 20;

  @ApiPropertyOptional({
    type: String,
    description: 'First message ID for pagination (to get older messages)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  firstId?: string;
}

export class GetEmbeddedChatMessagesByConversationIdInputDto extends GetEmbeddedChatMessagesByConversationIdQueryDto {
  token: string;
}

export class GetEmbeddedChatMessagesResponseDto {
  @ApiProperty({
    type: Number,
    description: 'Number of messages returned',
    example: 20,
  })
  @Expose()
  limit: number;

  @ApiProperty({
    type: Boolean,
    description: 'Whether there are more messages',
    example: true,
  })
  @Expose()
  hasMore: boolean;

  @ApiProperty({
    type: [EmbeddedChatMessageItemDto],
    description: 'List of messages',
  })
  @Expose()
  @Type(() => EmbeddedChatMessageItemDto)
  data: EmbeddedChatMessageItemDto[];
}
