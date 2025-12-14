import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { PageOptionsDto } from '@app/core/dtos';

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
}

export class GetEmbeddedChatMessagesByConversationIdQueryDto extends PageOptionsDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The id of the conversation',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  conversation_id: string;
}

export class GetEmbeddedChatMessagesByConversationIdInputDto extends GetEmbeddedChatMessagesByConversationIdQueryDto {
  token: string;
}
