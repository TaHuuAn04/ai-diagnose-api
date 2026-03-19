import { plainToInstance } from 'class-transformer';
import { MemoryStoredFile } from 'nestjs-form-data';
import { v4 as uuidv4 } from 'uuid';

import { ImageUploadDto } from '@app/core/dtos';
import { BadRequestException } from '@app/core/exception';

// Convert a single file to Base64
export function fileToBase64(
  file: MemoryStoredFile,
): ImageUploadDto {
  if (!['image/png', 'image/jpeg', 'application/pdf', 'image/jpg'].includes(file.mimetype)) {
    throw new BadRequestException('Unsupported file type');
  }   

  if (file.buffer.length === 0) {
    throw new BadRequestException('File is empty or corrupted');
  }

  const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const extension = file.originalName.split('.').pop(); 
  const name = extension ? file.originalName.replace(`.${extension}`, '') : file.originalName;

  return plainToInstance(ImageUploadDto, {
    fileName: extension ? `${name}.${uuidv4()}.${extension}` : `${name}.${uuidv4()}`,
    base64
  });
}

// Convert an array of files to Base64
export function filesToBase64(
  files?: MemoryStoredFile[],
): ImageUploadDto[] {
  if (!files || files.length === 0) {
    return [];
  }

  return files.map(file => fileToBase64(file));
}