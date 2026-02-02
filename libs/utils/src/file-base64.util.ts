import { MemoryStoredFile } from 'nestjs-form-data';

import { BadRequestException } from '@app/core/exception';

// Convert a single file to Base64
export function fileToBase64(
  file: MemoryStoredFile,
): string {
  if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.mimetype)) {
    throw new BadRequestException('Unsupported file type');
  }   

  if (file.buffer.length === 0) {
    throw new BadRequestException('File is empty or corrupted');
  }

  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

// Convert an array of files to Base64
export function filesToBase64(
  files?: MemoryStoredFile[],
): string[] {
  if (!files || files.length === 0) {
    return [];
  }

  return files.map(file => fileToBase64(file));
}