import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class ChatFileDto {
  @IsString()
  type: string;

  @IsString()
  transfer_method: 'remote_url' | 'local_file';

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  upload_file_id?: string;
}

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChatFileDto)
  files?: ChatFileDto[];
}

export class ChatMessageStreamInputDto extends ChatMessageStreamBodyDto {
  token: string;
}

export class UploadFileChatInputDto {
  file: Express.Multer.File;
  token: string;
}
