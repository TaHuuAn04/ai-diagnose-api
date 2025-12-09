import { ShiftStatus } from '../enums';

import { BaseEntity } from './base';

export class ShiftEntity extends BaseEntity {
  date: string;

  from: string;

  to: string;

  status: ShiftStatus;
}
