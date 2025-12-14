import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatMessageStreamBodyDto {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsOptional()
  conversation_id?: string;

  @IsString()
  @IsOptional()
  parent_message_id?: string;
}

export class ChatMessageStreamInputDto extends ChatMessageStreamBodyDto {
  token: string;
}
