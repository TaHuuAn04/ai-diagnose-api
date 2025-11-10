import { BaseEntity } from './base';

export class UserDifyTemplateEntity extends BaseEntity {
  userId: string;

  templateId: string;

  datasetId: string;

  datasetName: string;
}
