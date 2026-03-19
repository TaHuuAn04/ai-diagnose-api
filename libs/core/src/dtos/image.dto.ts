import { Expose } from "class-transformer";

import { ImageType } from "../domain/enums";

export class ImageInfoDto {
  @Expose()
  dataUrl?: string | null;

  @Expose()
  description?: string | null;

  @Expose()
  fileName: string;
  
  @Expose()
  order?: number | null;

  @Expose()
  base64?: string | null;

  @Expose()
  type: ImageType;
}

export class ImageUploadDto {
  @Expose()
  fileName: string;

  @Expose()
  base64: string;
}