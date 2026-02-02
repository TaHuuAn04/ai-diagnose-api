import { ImageReference, ImageType } from '../enums';

import { BaseEntity } from './base';

export class ImageEntity extends BaseEntity {
  referenceId: string;

  referenceType: ImageReference;

  dataUrl?: string | null;

  description?: string | null;

  order?: number | null;

  base64?: string | null;

  type: ImageType;
}
