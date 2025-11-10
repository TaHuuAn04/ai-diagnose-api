import { BaseEntity } from './base';

export class BusinessEntity extends BaseEntity {
  userId: string;

  name: string;

  email: string;

  phoneCode: string;

  phoneNumber: string;

  address: string;

  domain: string;

  description: string;
}
