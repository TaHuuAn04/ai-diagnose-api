import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { BlockingModeResponseDto } from '../../dify-ai/dtos';

export class ChatMessageBlockBodyDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsUUID()
  @IsOptional()
  conversation_id?: string;

  @IsUUID()
  @IsOptional()
  parent_message_id?: string;
}

export class ChatMessageBlockInputDto extends ChatMessageBlockBodyDto {
  token: string;
}

export class ChatMessageBlockResponseDto extends BlockingModeResponseDto {
  @Expose()
  query: string;
}
