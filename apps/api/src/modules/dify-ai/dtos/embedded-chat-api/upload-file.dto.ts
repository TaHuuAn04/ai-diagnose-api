import { Expose } from 'class-transformer';

import { HttpMethod } from '@app/core/domain/enums';
import { HttpFetchDto } from '@app/core/http';

export class UploadFileChatDifyAiResponseDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() size: number;
  @Expose() extension: string;
  @Expose() mime_type: string;
  @Expose() created_by: string;
  @Expose() created_at: number;
}

export class UploadFileChatDifyAiBodyDto {
  file: Express.Multer.File;
}

export class UploadFileChatDifyAiInputDto {
  file: Express.Multer.File;
  token: string;
}

export class UploadFileChatDifyAiHttpDto extends HttpFetchDto {
  public static url = 'api/files/upload';
  public method = HttpMethod.POST;
  public url = UploadFileChatDifyAiHttpDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: UploadFileChatDifyAiResponseDto;

  constructor(public bodyDto: UploadFileChatDifyAiBodyDto) {
    super();
  }

  public toFormData(): FormData {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const file: Express.Multer.File = Array.isArray(this.bodyDto.file)
      ? this.bodyDto.file[0]
      : this.bodyDto.file;
    const blob = new Blob([new Uint8Array(file.buffer)], {
      type: file.mimetype,
    });
    formData.append('file', blob, file.originalname);
    return formData;
  }
}
