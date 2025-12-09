import { ImageType } from '../enums';

import { AppointmentEntity } from './appointment';
import { BaseEntity } from './base';
import { ConsultationEntity } from './consultation';

export class ImageEntity extends BaseEntity {
  appointmentId: string;

  consultationId: string;

  data_url: string;

  description?: string | null;

  type: ImageType;

  appointment?: AppointmentEntity | null;

  consultation?: ConsultationEntity | null;
}
