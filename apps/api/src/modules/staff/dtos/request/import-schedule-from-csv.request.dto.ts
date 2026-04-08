import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty } from "class-validator";
import { HasMimeType, IsFile, MemoryStoredFile } from "nestjs-form-data";

export class ImportScheduleFromCSVRequestDto {
  @ApiProperty({
    description: 'File CSV need to be imported',
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  @IsFile()
  @HasMimeType('text/csv')
  file: MemoryStoredFile;
}